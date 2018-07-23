import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import _ from 'lodash'
import logger from '../logger'
import * as V from "../validation";
import * as U from '../utils'

mongoose.Promise = global.Promise

let releasePlanSchema = mongoose.Schema({
    estimation: {
        _id: {type: mongoose.Schema.ObjectId}
    },
    release: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Release name is required']},
        iteration: {
            _id: {type: mongoose.Schema.ObjectId, required: true},
            idx: Number,
            iterationType: {type: String}
        }
    },
    task: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Task name is required']},
        description: String,
        estimatedHours: {type: Number, default: 0},
        estimatedBilledHours: {type: Number, default: 0},
        alreadyBilledHours: {type: Number, default: 0}
    },
    feature: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    owner: {type: String, enum: [SC.OWNER_LEADER, SC.OWNER_MANAGER]},
    flags: [{
        type: String,
        enum: SC.ALL_WARNING_NAME_ARRAY
    }],
    planning: {
        plannedHours: {type: Number, default: 0},
        minPlanningDate: Date, // minimum planning date for this release plan
        maxPlanningDate: Date, // maximum planning for this release plan
        plannedTaskCounts: {type: Number, default: 0},  // Number of tasks-plans against this release plan
        plannedHoursEstimatedTasks: {type: Number, default: 0}, // sum of planned hours of all task plans but it will not cross estimated hours
        employees: [{
            _id: mongoose.Schema.ObjectId,
            plannedHours: {type: Number, default: 0}, // Number of planned hours against this employee
            minPlanningDate: Date, // minimum planned date against this employee
            maxPlanningDate: Date, // maximum planned date against this employee
            plannedTaskCounts: {type: Number, default: 0} // number of task plans against this employee
        }]
    },
    report: {
        reportedHours: {type: Number, default: 0},
        baseHoursProgress: {type: Number, default: 0}, // hours that would be considered as base for calculating progress
        minReportedDate: Date,
        maxReportedDate: Date,
        reportedTaskCounts: {type: Number, default: 0}, // Number of tasks-plans that are reported till now
        plannedHoursReportedTasks: {type: Number, default: 0}, // sum of planned hours of reported task plans
        progress: {type: Number, default: 0.0}, // overall progress of this release plan in percentage
        finalStatus: {type: String, enum: [SC.STATUS_PENDING, SC.STATUS_COMPLETED]},
        employees: [{
            _id: mongoose.Schema.ObjectId,
            reportedHours: {type: Number, default: 0}, // Number of reported hours by employee
            minReportedDate: Date, // minimum reported date against this employee
            maxReportedDate: Date, // maximum reported date against this employee
            reportedTaskCounts: {type: Number, default: 0}, // number of task reported this employee,
            plannedHoursReportedTasks: {type: Number, default: 0}, // planned hours assigned against reported tasks, helps in tracking progress
            finalStatus: {type: String, enum: [SC.STATUS_PENDING, SC.STATUS_COMPLETED]} // final status reported by employee
        }]
    },
    comments: [{
        name: {type: String, required: [true, 'Comment name is required']},
        date: {type: Date, required: [true, 'Comment date is required']},
        comment: {type: String, required: [true, 'Comment is required']},
        dateString: String,
        commentType: {
            type: String,
            enum: [SC.COMMENT_EMERGENCY, SC.COMMENT_CRITICAL, SC.COMMENT_URGENT, SC.COMMENT_REPORTING, SC.COMMENT_FYI_ONLY]
        },
    }],
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
}, {
    usePushEach: true
})


/**
 * Adds a release plan for an estimated tasks via estimation process
 */
releasePlanSchema.statics.addEstimatedReleasePlan = async (release, iterationIndex, estimation, estimationTask) => {
    let releasePlanInput = {}
    releasePlanInput.estimation = {
        _id: estimation._id
    }

    releasePlanInput.release = Object.assign({}, release.toObject(), {
        iteration: {
            _id: release.iterations[iterationIndex]._id,
            idx: iterationIndex,
            iterationType: SC.ITERATION_TYPE_ESTIMATED
        }
    })

    releasePlanInput.flags = [SC.WARNING_UNPLANNED]
    releasePlanInput.report = {}

    logger.debug('project award addRelease(): estimationTask.estimator.estimatedHours is ' + estimationTask.estimator.estimatedHours)
    logger.debug('project award addRelease(): release.expectedBilledHours is ' + release.iterations[iterationIndex].expectedBilledHours)
    logger.debug('project award addRelease(): estimation.estimatedHours is ' + estimation.estimatedHours)
    let expectedBilledHours = estimationTask.estimator.estimatedHours * (release.iterations[iterationIndex].expectedBilledHours / estimation.estimatedHours)
    logger.debug('project award addRelease(): expected billed hours is ' + expectedBilledHours)

    releasePlanInput.task = {
        _id: estimationTask._id,
        name: estimationTask.estimator.name,
        estimatedHours: estimationTask.estimator.estimatedHours,
        description: estimationTask.estimator.description,
        estimatedBilledHours: expectedBilledHours.toFixed(2)
    }

    if (estimationTask.feature && estimationTask.feature._id)
        releasePlanInput.feature = estimationTask.feature

    let releasePlan = await
        ReleasePlanModel.create(releasePlanInput)
    /**
     * We can create warning in the background as these unplanned warnings are not visible on project
     * award.
     */
    MDL.WarningModel.addUnplanned(release, releasePlan).then(() => {
        // do nothing
    })

    return releasePlan
}

/**
 * Adds a planned release plan - Plan that is added from release page
 */
releasePlanSchema.statics.addPlannedReleasePlan = async (releasePlanInput, user) => {
    V.validate(releasePlanInput, V.plannedReleasePlanAddStruct)

    // Find index of iteration with type as 'planned'
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releasePlanInput.release._id))
    if (!release) {
        throw new AppError('Release this Task is added against is not found', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    }

    let userRoleInThisRelease = await MDL.ReleaseModel.getUserRolesInThisRelease(release._id, user)
    if (!userRoleInThisRelease) {
        throw new AppError('User is not having any role in this release so don`t have any access', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    if (U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRoleInThisRelease)) {
    if (!U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRoleInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can add a planned release plan', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let iterationIndex = release.iterations.findIndex(it => it.type == SC.ITERATION_TYPE_PLANNED)

    logger.debug("addPlannedReleasePlan(): iterationIndex found as ", {iterationIndex})

    if (iterationIndex <= -1)
        throw new AppError('Iteration with type [' + SC.ITERATION_TYPE_PLANNED + "] not found. ", EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)

    logger.debug("planned Iteration ", {"iteration": release.iterations[iterationIndex]})

    let releasePlan = new ReleasePlanModel()

    releasePlan.release = release.toObject()

    releasePlan.release.iteration = {
        _id: release.iterations[iterationIndex]._id,
        idx: iterationIndex,
        iterationType: SC.ITERATION_TYPE_PLANNED
    }

    releasePlan.flags = [SC.WARNING_UNPLANNED]
    releasePlan.report = {}

    releasePlan.task = {
        name: releasePlanInput.name,
        description: releasePlanInput.description,
        estimatedHours: releasePlanInput.estimatedHours,
        estimatedBilledHours: releasePlanInput.estimatedBilledHours
    }

    logger.debug("addPlannedReleasePlan(): saving release plan ", {releasePlan: releasePlan.toObject()})

    //let releasePlan = await ReleasePlanModel.create(releasePlanInput)
    MDL.WarningModel.addUnplanned(release, releasePlan).then(() => {
        // do nothing
    })

    // update 'planned' iteration to add estimated hours and estimated billed hours of this release plan
    release.iterations[iterationIndex].expectedBilledHours += releasePlanInput.estimatedBilledHours
    release.iterations[iterationIndex].estimatedHours += releasePlanInput.estimatedHours
    await release.save()
    return await releasePlan.save()
}

/**
 * Adds an unplanned release plan
 * An unplanned release plan would only be reported. No task would be planned against such release
 * plans. They would be useful in cases where there is no task to complete but there are several
 * small things to do on regular bases (like issue fixing)
 */

releasePlanSchema.statics.addUnplannedReleasePlan = async (releasePlanInput, user) => {
    V.validate(releasePlanInput, V.unplannedReleasePlanAddStruct)

    // Find index of iteration with type as 'planned'
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releasePlanInput.release._id), {
        "iterations._id": 1,
        "iterations.type": 1,
        "name": 1,
        "project.name": 1
    })
    if (!release) {
        throw new AppError('Release this Task is added against is not found', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    }

    let userRoleInThisRelease = await MDL.ReleaseModel.getUserRolesInThisRelease(release._id, user)
    if (!userRoleInThisRelease) {
        throw new AppError('User is not having any role in this release so don`t have any access', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    if (!U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRoleInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can add a planned release plan', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let iterationIndex = release.iterations.findIndex(it => it.type == SC.ITERATION_TYPE_UNPLANNED)

    logger.debug("addPlannedReleasePlan(): iterationIndex found as ", {iterationIndex})

    if (iterationIndex <= -1)
        throw new AppError('Iteration with type [' + SC.ITERATION_TYPE_PLANNED + "] not found. ", EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)

    logger.debug("planned Iteration ", {"iteration": release.iterations[iterationIndex]})

    let releasePlan = new ReleasePlanModel()

    releasePlan.release = release.toObject()

    releasePlan.release.iteration = {
        _id: release.iterations[iterationIndex]._id,
        idx: iterationIndex,
        iterationType: SC.ITERATION_TYPE_UNPLANNED
    }

    releasePlan.flags = [] // no flags for such release plans
    releasePlan.report = {}

    releasePlan.task = {
        name: releasePlanInput.name,
        description: releasePlanInput.description
    }

    logger.debug("addPlannedReleasePlan(): saving release plan ", {releasePlan: releasePlan.toObject()})
    return await releasePlan.save()
}


releasePlanSchema.statics.getReleasePlansByReleaseID = async (params, user) => {
    let releaseID = params.releaseID
    let empflag = params.empflag
    let status = params.status

    if (!releaseID) {
        throw new AppError('Release Id not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID))

    if (!release) {
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (!empflag) {
        throw new AppError('Employee Flag not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    if (!status) {
        throw new AppError('Status not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    let filter = {'release._id': release._id}

    if (status && status.toLowerCase() !== SC.ALL && empflag && empflag.toLowerCase() !== SC.ALL)
        filter = {'release._id': release._id, 'report.finalStatus': status, 'flags': empflag}
    else if (status && status.toLowerCase() !== SC.ALL)
        filter = {'release._id': release._id, 'report.finalStatus': status}
    else if (empflag && empflag.toLowerCase() !== SC.ALL)
        filter = {'release._id': release._id, 'flags': empflag}

    return await ReleasePlanModel.find(filter)
}

releasePlanSchema.statics.getReleasePlanByID = async (releasePlanID, user) => {
    if (!releasePlanID) {
        throw new AppError('release Plan Id not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }
    let releasePlan = await ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID))
    releasePlan = releasePlan.toObject()

    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInThisRelease(releasePlan.release._id.toString(), user)
    if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER, SC.ROLE_DEVELOPER, SC.ROLE_NON_PROJECT_DEVELOPER], rolesInRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + 'or' + SC.ROLE_DEVELOPER + 'or' + SC.ROLE_NON_PROJECT_DEVELOPER + '] can see Release Plan Details', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN
        )
    }
    releasePlan.rolesInThisRelease = rolesInRelease
    return releasePlan
}


releasePlanSchema.statics.getReleaseDevelopersByReleasePlanID = async (releasePlanID, user) => {
    if (!releasePlanID) {
        throw new AppError('release Plan Id not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    let releasePlan = await ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID))
    releasePlan = releasePlan.toObject()

    let releaseTeamObject = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releasePlan.release._id), {
        team: 1
    })
    return releaseTeamObject.team
}

const ReleasePlanModel = mongoose.model('ReleasePlan', releasePlanSchema)
export default ReleasePlanModel
