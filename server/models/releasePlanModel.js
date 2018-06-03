import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import _ from 'lodash'

mongoose.Promise = global.Promise

let releasePlanSchema = mongoose.Schema({
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true}
    },
    release: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Release name is required']}
    },
    task: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Task name is required']},
        description: String,
        estimatedHours: {type: Number, default: 0},
        initiallyEstimated: {type: Boolean, default: false}
    },
    feature: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    owner: {type: String, enum: [SC.OWNER_LEADER, SC.OWNER_MANAGER]},
    flags: [{
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_COMPLETED_BEFORE_END_DATE, SC.WARNING_PENDING_ON_END_DATE]
    }],
    planning: {
        plannedHours: {type: Number, default: 0},
        minPlanningDate: Date, // minimum planning date for this release plan
        maxPlanningDate: Date, // maximum planning for this release plan
        plannedTaskCounts: {type: Number, default: 0},  // Number of tasks-plans against this release plan
        employee: [{
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
        finalStatus: {type: String, enum: [SC.STATUS_PENDING, SC.STATUS_COMPLETED]},
        employee: [{
            _id: mongoose.Schema.ObjectId,
            reportedHours: {type: Number, default: 0}, // Number of reported hours by employee
            minReportedDate: Date, // minimum reported date against this employee
            maxReportedDate: Date, // maximum reported date against this employee
            reportedTaskCounts: {type: Number, default: 0}, // number of task reported this employee,
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

releasePlanSchema.statics.addReleasePlan = async (release, estimation, estimationTask) => {
    let releasePlanInput = {}
    releasePlanInput.estimation = {
        _id: estimation._id
    }
    releasePlanInput.release = release
    releasePlanInput.flags = [SC.WARNING_UNPLANNED]
    releasePlanInput.report = {}
    releasePlanInput.task = {
        _id: estimationTask._id,
        name: estimationTask.estimator.name,
        estimatedHours: estimationTask.estimator.estimatedHours,
        description: estimationTask.estimator.description,
        initiallyEstimated: estimationTask.initiallyEstimated
    }

    if (estimationTask.feature && estimationTask.feature._id)
        releasePlanInput.feature = estimationTask.feature

    let releasePlan = await ReleasePlanModel.create(releasePlanInput)
    /**
     * We can create warning in the background as these unplanned warnings are not visible on project
     * award.
     */
    MDL.WarningModel.addUnplanned(releasePlan)

    return releasePlan
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

    if (status && status.toLowerCase() != 'all' && empflag && empflag.toLowerCase() != 'all')
        filter = {'release._id': release._id, 'report.finalStatus': status, 'flags': {$in: [empflag]}}
    else if (status && status.toLowerCase() != 'all')
        filter = {'release._id': release._id, 'report.finalStatus': status}
    else if (empflag && empflag.toLowerCase() != 'all')
        filter = {'release._id': release._id, 'flags': {$in: [empflag]}}

    return await ReleasePlanModel.find(filter)
}

releasePlanSchema.statics.getReleasePlanByID = async (releasePlanID, user) => {
    if (!releasePlanID) {
        throw new AppError('release Plan Id not found ', EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }
    let releasePlan = await ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID))
    releasePlan = releasePlan.toObject()

    let roleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(releasePlan.release._id.toString(), user)
    if (!_.includes([SC.ROLE_LEADER, SC.ROLE_MANAGER, SC.ROLE_DEVELOPER, SC.ROLE_NON_PROJECT_DEVELOPER], roleInRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + 'or' + SC.ROLE_DEVELOPER + 'or' + SC.ROLE_NON_PROJECT_DEVELOPER + '] can see Release Plan Details', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN
        )
    }
    releasePlan.highestRoleInThisRelease = roleInRelease
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
