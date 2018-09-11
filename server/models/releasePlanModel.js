import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import logger from '../logger'
import * as V from "../validation";
import * as U from '../utils'

mongoose.Promise = global.Promise

let releasePlanSchema = mongoose.Schema({
    creator: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String}
    },
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
        alreadyBilledHours: {type: Number, default: 0},
        type: {
            type: String,
            enum: [SC.TYPE_DEVELOPMENT, SC.TYPE_MANAGEMENT, SC.TYPE_TESTING, SC.TYPE_REVIEW, SC.TYPE_COMPANY]
        }
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
            enum: [SC.TYPE_BLOCKING, SC.TYPE_INFORMATION, SC.TYPE_WAITING, SC.TYPE_CLARIFICATION, SC.TYPE_REPORT_COMMENT]
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
        estimatedBilledHours: expectedBilledHours.toFixed(2),
        type: estimationTask.type
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

    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(release._id, user)
    if (!U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRolesInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can add a "planned" release plan', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
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
        estimatedBilledHours: releasePlanInput.estimatedBilledHours,
        type: releasePlanInput.type
    }

    releasePlan.creator = {
        _id: user._id,
        name: U.getFullName(user)
    }

    logger.debug("addPlannedReleasePlan(): saving release plan ", {releasePlan: releasePlan.toObject()})

    //let releasePlan = await ReleasePlanModel.create(releasePlanInput)
    MDL.WarningModel.addUnplanned(release, releasePlan).then(() => {
        // do nothing
    })


    // Progress of iteration would also be impacted due to addition of this task

    // Current progress estimated hours
    let sumProgressEstimatedHours = release.iterations[iterationIndex].estimatedHours * release.iterations[iterationIndex].progress


    // update 'planned' iteration to add estimated hours and estimated billed hours of this release plan
    release.iterations[iterationIndex].expectedBilledHours += releasePlanInput.estimatedBilledHours
    release.iterations[iterationIndex].estimatedHours += releasePlanInput.estimatedHours
    // Please note here sum progress estimated hours is divided by new estimated hours (after adding estimated hours of new task)
    release.iterations[iterationIndex].progress = sumProgressEstimatedHours / release.iterations[iterationIndex].estimatedHours

    let idx = release.iterations[iterationIndex].stats.findIndex(s => s.type == releasePlanInput.type)
    console.log("######### STATS IDX ", idx)

    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        release.iterations[iterationIndex].stats[idx].estimatedHours += releasePlanInput.estimatedHours
    } else {
        // Push new element to stats for keeping details of this type of task
        release.iterations[iterationIndex].stats.push({
            type: releasePlanInput.type,
            estimatedHours: releasePlanInput.estimatedHours
        })
    }

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

    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(release._id, user)
    if (!U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRolesInThisRelease)) {
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
    releasePlan.task = {
        name: releasePlanInput.name,
        description: releasePlanInput.description,
        type: releasePlanInput.type
    }

    releasePlan.creator = {
        _id: user._id,
        name: U.getFullName(user)
    }

    logger.debug("addPlannedReleasePlan(): saving release plan ", {releasePlan: releasePlan.toObject()})

    if (!release.iterations[iterationIndex].stats) {
        release.iterations[iterationIndex].stats = []
    }

    let idx = release.iterations[iterationIndex].stats.findIndex(s => s.type == releasePlanInput.type)
    console.log("######### STATS IDX ", idx)

    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        release.iterations[iterationIndex].stats[idx].estimatedHours += releasePlanInput.estimatedHours
    } else {
        // Push new element to stats for keeping details of this type of task
        release.iterations[iterationIndex].stats.push({
            type: releasePlanInput.type,
            estimatedHours: releasePlanInput.estimatedHours
        })
    }

    await release.save()

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

releasePlanSchema.statics.search = async (criteria, user) => {
    if (criteria) {
        let filter = {}

        if (criteria.releaseID) {
            // Search is based on release ID
            filter['release._id'] = mongoose.Types.ObjectId(criteria.releaseID)
            let release = await MDL.ReleaseModel.findById(criteria.releaseID)
            if (!release) {
                throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
            }

            let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInRelease(release, user)
            if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER], userRolesInThisRelease) && !U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
                throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can search Release Tasks of any release', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
            }
        } else {
            // As release is not supplied complete task plans are searched
            if (!U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
                throw new AppError('Only user with role [' + SC.ROLE_TOP_MANAGEMENT + '] can see Release Tasks spanning multiple releases', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
            }
        }

        if (criteria.status == SC.STATUS_UNPLANNED) {
            filter['planning.minPlanningDate'] = null
            // since status is unplanned, dates sent should not make any different as it is unplanned and hence there would be no date associated
        } else {
            let dateFilter = undefined
            if (criteria.startDate && criteria.endDate) {
                // Release plan should have planned between this
                let startMoment = U.momentInUTC(criteria.startDate)
                let endMoment = U.momentInUTC(criteria.endDate)
                dateFilter = {'$and': [{'planning.maxPlanningDate': {$gte: startMoment}}, {'planning.minPlanningDate': {$lte: endMoment}}]}
            } else if (criteria.startDate) {
                let startMoment = U.momentInUTC(criteria.startDate)
                dateFilter = {'planning.minPlanningDate': {$gte: startMoment}}
            } else if (criteria.endDate) {
                let endMoment = U.momentInUTC(criteria.endDate)
                dateFilter = {'planning.maxPlanningDate': {$lte: endMoment}}
            } else if (criteria.status == SC.STATUS_PLANNED) {
                // Planned but not reported even once
                dateFilter = {}
                dateFilter['planning.minPlanningDate'] = {$ne: null}
                dateFilter['report.finalStatus'] = null
            }

            if (dateFilter) {
                if (!criteria.status)
                    filter['$or'] = [{'planning.minPlanningDate': null}, dateFilter]
                else
                    filter = Object.assign({}, filter, dateFilter)
            }
        }

        if (criteria.status && criteria.status != SC.STATUS_UNPLANNED && criteria.status != SC.STATUS_PLANNED) {
            filter['report.finalStatus'] = criteria.status
        }

        if (criteria.flag) {
            filter['flags'] = criteria.flag
        }

        logger.debug("searchReleasePlans() ", {filter})
        return await ReleasePlanModel.find(filter).sort({'planning.minPlanningDate': 1})
    }

    return []
}

releasePlanSchema.statics.getReleasePlanByID = async (releasePlanID, user) => {
    if (!releasePlanID) {
        throw new AppError('release Plan Id not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }
    let releasePlan = await ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID))
    releasePlan = releasePlan.toObject()

    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(releasePlan.release._id.toString(), user)
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

releasePlanSchema.statics.getReleasePlansByIDs = async (releasePlanIDs, select) => {
    let releasePlans = []

    for (const releasePlanID of releasePlanIDs) {
        let releasePlan

        if (select)
            releasePlan = await ReleasePlanModel.findById(releasePlanID, select)
        else
            releasePlan = await ReleasePlanModel.findById(releasePlanID)

        releasePlans.push(releasePlan)
    }
    return releasePlans
}

releasePlanSchema.statics.removeReleasePlanById = async (releasePlanID, user) => {
    let releasePlan = await ReleasePlanModel.findById(releasePlanID)
    if (!releasePlan)
        throw new AppError('Release Task not found ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (releasePlan.release.iteration.type == SC.ITERATION_TYPE_ESTIMATED)
        throw new AppError('Release-Task from estimation cannot be deleted.', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    let release = await MDL.ReleaseModel.findById(releasePlan.release._id)

    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(release._id, user)
    if (!U.includeAny([SC.ROLE_MANAGER, SC.ROLE_LEADER], userRolesInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ', ' + SC.ROLE_LEADER + '] can remove "planned/unplanned" Release-Task', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    // check to see if there are Day-Task assigned against this Release-Task if so it cannot be removed

    let count = await MDL.TaskPlanningModel.count({
        'releasePlan._id': releasePlan._id
    })

    if (count > 0) {
        throw new AppError('Please delete all Day-Tasks first before removing this Release-Task.', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let iterationIndex = release.iterations.findIndex(it => it.type == SC.ITERATION_TYPE_PLANNED)
    logger.debug("addPlannedReleasePlan(): iterationIndex found as ", {iterationIndex})

    if (iterationIndex <= -1)
        throw new AppError('Iteration with type [' + SC.ITERATION_TYPE_PLANNED + "] not found. ", EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)
    logger.debug("planned Iteration ", {"iteration": release.iterations[iterationIndex]})

    // Progress of iteration would also be impacted due to addition of this task

    // Current progress estimated hours
    let sumProgressEstimatedHours = release.iterations[iterationIndex].estimatedHours * release.iterations[iterationIndex].progress


    // update 'planned' iteration to add estimated hours and estimated billed hours of this release plan
    release.iterations[iterationIndex].expectedBilledHours -= releasePlan.task.estimatedBilledHours
    release.iterations[iterationIndex].estimatedHours -= releasePlan.task.estimatedHours


    // Please note here sum progress estimated hours is divided by new estimated hours (after removing estimated hours of deleted task)


    if (release.iterations[iterationIndex].estimatedHours == 0) {
        // all tasks have been deleted
        release.iterations[iterationIndex].progress = 0
    } else {
        release.iterations[iterationIndex].progress = sumProgressEstimatedHours / release.iterations[iterationIndex].estimatedHours
    }

    let idx = release.iterations[iterationIndex].stats.findIndex(s => s.type == releasePlan.task.type)
    console.log("######### STATS IDX ", idx)

    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        release.iterations[iterationIndex].stats[idx].estimatedHours -= releasePlan.task.estimatedHours
    } else {
        throw new AppError("Development type [" + releasePlan.task.type + "] section should have found in release as we are deleting Release-Task")
    }

    await release.save()
    return await releasePlan.remove()
}

/**
 * This operation would allow user to update release plan after it has been created.
 * Manager would be able to update description/estimated hours of task using this operation
 */

releasePlanSchema.statics.updatePlannedReleasePlan = async (releasePlanInput, user) => {
    V.validate(releasePlanInput, V.plannedReleasePlanUpdateStruct)

    let releasePlan = await MDL.ReleasePlanModel.findById(releasePlanInput._id)

    if (!releasePlan)
        throw new AppError('Release-Task that is updated is not found', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    if (releasePlan.release.iteration && releasePlan.release.iteration.iterationType != SC.ITERATION_TYPE_PLANNED)
        throw new AppError('Release-Task that is updated does not belong to "planned iteration"', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    // Find index of iteration with type as 'planned'
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releasePlan.release._id))
    if (!release) {
        throw new AppError('Release this Task is added against is not found', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    }

    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(release._id, user)
    if (!U.includeAny([SC.ROLE_MANAGER], userRolesInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + '] can add a "planned" release plan', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let iterationIndex = release.iterations.findIndex(it => it.type == SC.ITERATION_TYPE_PLANNED)

    //logger.debug("updatePlannedReleasePlan(): iterationIndex found as ", {iterationIndex})

    if (iterationIndex <= -1)
        throw new AppError('Iteration with type [' + SC.ITERATION_TYPE_PLANNED + "] not found. ", EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)

    //logger.debug("planned Iteration ", {"iteration": release.iterations[iterationIndex]})

    // Calculate various diffs due to this update
    let estimatedHoursDiff = releasePlanInput.estimatedHours - releasePlan.task.estimatedHours
    let oldProgressEstimatedHours = release.iterations[iterationIndex].estimatedHours * release.iterations[iterationIndex].progress
    let oldProgressEstimatedHoursReleasePlan = releasePlan.report.progress * releasePlan.task.estimatedHours
    let othersProgressEstimatedHours = oldProgressEstimatedHours - oldProgressEstimatedHoursReleasePlan

    releasePlan.task.name = releasePlanInput.name
    releasePlan.task.description = releasePlanInput.description
    releasePlan.task.estimatedHours = releasePlanInput.estimatedHours
    releasePlan.task.estimatedBilledHours = releasePlanInput.estimatedBilledHours
    // Get new progress after modifying estimated hours
    let newReleasePlanProgress = ReleasePlanModel.getNewProgressPercentage(releasePlan)
    let newProgressEstimatedHoursReleasePlans = Math.round(newReleasePlanProgress * releasePlan.task.estimatedHours)

    let newEstimatedHours = release.iterations[iterationIndex].estimatedHours + estimatedHoursDiff
    let newProgressEstimatedHours = Math.round(othersProgressEstimatedHours + newProgressEstimatedHoursReleasePlans)
    let newReleaseProgress = (newProgressEstimatedHours/newEstimatedHours).toFixed(2)

    logger.debug("updateTaskReportPlannedUpdateRelease(): ", {
        oldProgressEstimatedHours,
        oldProgressEstimatedHoursReleasePlan,
        newProgressEstimatedHoursReleasePlans,
        newEstimatedHours,
        newProgressEstimatedHours,
        newReleaseProgress,
        newReleasePlanProgress
    })

    release.iterations[iterationIndex].progress = newReleaseProgress
    releasePlan.report.progress = newReleasePlanProgress
    //release.iterations[iterationIndex].progress = release.iterations[iterationIndex].progress.toFixed(2)

    logger.debug("new release progress is ", {newReleaseProgress: release.iterations[iterationIndex].progress})


    /*
    let sumProgressEstimatedHours = release.iterations[iterationIndex].estimatedHours * release.iterations[iterationIndex].progress


    // update 'planned' iteration to add estimated hours and estimated billed hours of this release plan
    release.iterations[iterationIndex].expectedBilledHours += estimatedBilledHoursDiff
    release.iterations[iterationIndex].estimatedHours += estimatedHoursDiff
    // Please note here sum progress estimated hours is divided by new estimated hours (after adding estimated hours of new task)
    release.iterations[iterationIndex].progress = sumProgressEstimatedHours / release.iterations[iterationIndex].estimatedHours

    let idx = release.iterations[iterationIndex].stats.findIndex(s => s.type == releasePlanInput.type)
    console.log("######### STATS IDX ", idx)

    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        release.iterations[iterationIndex].stats[idx].estimatedHours += releasePlanInput.estimatedHours
    } else {
        // Push new element to stats for keeping details of this type of task
        release.iterations[iterationIndex].stats.push({
            type: releasePlanInput.type,
            estimatedHours: releasePlanInput.estimatedHours
        })
    }

    await release.save()
    return await releasePlan.save()
    */
    return {}
}

/**
 * Calculates new progress percentage based on updated data in release plan, would not modify release plan rather just return progress
 * @param releasePlan
 * @returns {string}
 */
releasePlanSchema.statics.getNewProgressPercentage = (releasePlan) => {

    let finalStatus = releasePlan.report.finalStatus

    let progress = 0
    if (finalStatus && finalStatus == SC.STATUS_COMPLETED) {
        // As status of this release plan is completed progress would be 1
        progress = 100
        logger.debug('getNewProgressPercentage(): reported status is completed progress would be 100 percent')
    } else {
        let baseHours = releasePlan.report.reportedHours + releasePlan.planning.plannedHours - releasePlan.report.plannedHoursReportedTasks
        // see if base hours crossed estimated hours, only then it would be considered as new base hours to calculate progress
        if (baseHours < releasePlan.task.estimatedHours) {
            baseHours = releasePlan.task.estimatedHours
        }
        logger.debug('getNewProgressPercentage(): [baseHours] ', {baseHours})
        // now that we have base hours we would calculate progress by comparing it against reported hours
        if (baseHours > 0)
            progress = releasePlan.report.reportedHours * 100 / baseHours
        else {
            // In a special case where estimated hours of task is 0 hours and no planning is added yet then it would be considered to be complete
            progress = 100
        }
        logger.debug('getNewProgressPercentage(): [progress] ', {progress})
    }
    return progress.toFixed(2)
}


const ReleasePlanModel = mongoose.model('ReleasePlan', releasePlanSchema)
export default ReleasePlanModel
