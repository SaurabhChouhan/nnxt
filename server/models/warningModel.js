import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import * as U from '../utils'
import logger from '../logger'
import * as MDL from './'

mongoose.Promise = global.Promise


/**
 * Source - This is true for release/releaseplan/taskplan when they are the cause of this warning. Other reelease/releaseplan/taskplan with source as false
 * are those that are affected by that warning but have not contributed to that warning
 *
 * isUnresolvable - Some warning cannot be resolved using any action like 'Release date missed' cannot be resolved because no action would make that warning
 * go.
 *
 *
 */

let warningSchema = mongoose.Schema({
    type: {
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_TOO_MANY_HOURS, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_RELEASE_DATE_MISSED_1, SC.WARNING_RELEASE_DATE_MISSED_2, SC.WARNING_RELEASE_DATE_MISSED_3, SC.WARNING_RELEASE_DATE_MISSED_4, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_UNREPORTED, SC.WARNING_PENDING_ON_END_DATE, SC.WARNING_COMPLETED_BEFORE_END_DATE]
    },
    isUnresolvable: {type: Boolean, default: false},
    releases: [{
        _id: mongoose.Schema.ObjectId,
        name: {type: String},
        project: {
            name: {type: String, required: [true, 'Project name is required']}
        },
        source: {type: Boolean, default: false}
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId,
        task: {
            name: {type: String, required: [true, 'Task name is required']}
        },
        source: {type: Boolean, default: false}
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId,
        release: {
            _id: mongoose.Schema.ObjectId,
        },
        releasePlan: {
            _id: mongoose.Schema.ObjectId,
        },
        source: {type: Boolean, default: false}
    }],
    employeeDays: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        dateString: String,
        date: {type: Date, default: Date.now()},
    }],
    raisedOn: {type: Date, default: Date.now()},
    mute: {type: Boolean, default: false}
}, {
    usePushEach: true
})


warningSchema.statics.addUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // unplanned warning would be raised against a single release and a single release plan
    var warning = {}
    warning.type = SC.WARNING_UNPLANNED
    warning.releases = [{
        _id: mongoose.Types.ObjectId(releasePlan.release._id),
        source: true
    }]
    warning.releasePlans = [{
        _id: mongoose.Types.ObjectId(releasePlan._id),
        source: true
    }]
    /*
      I have not intentionally checked for existence of warning as duplicate warning would not cause
      much problem and any such duplicate warning would be visible on UI and duplicate calls would be
      fixed. This would save un-necessary existence check of warnings
     */

    return await WarningModel.create(warning)
}

warningSchema.statics.addToManyHours = async (toManyHoursWarningInput) => {
    // TODO: Add appropriate validation
    /*
 let toManyHoursWarningInput = {
    release: {
        _id: release._id.toString(),
        source: true
    },
    releasePlan: {
        _id: releasePlan._id.toString(),
        source: true
    },
    taskPlan: {
        _id: taskPlanning._id.toString(),
        source: true
    },
    employeeDay: {
        _id: employeeDays._id.toString(),
        employee: {
            _id: employeeDays.employee._id.toString()
        },
        dateString: employeeDays.dateString
    }
}*/
    // toManyHours warning would be raised against a single release and a single release plan
    let warning = {}
    warning.type = SC.WARNING_TOO_MANY_HOURS
    warning.releases = [{
        _id: toManyHoursWarningInput.release._id,
        source: toManyHoursWarningInput.release.source
    }]

    warning.releasePlans = [{
        _id: toManyHoursWarningInput.releasePlan._id,
        source: toManyHoursWarningInput.releasePlan.source
    }]
    warning.taskPlans = [{
        _id: toManyHoursWarningInput.taskPlan._id,
        source: toManyHoursWarningInput.taskPlan.source
    }]
    warning.employeeDays = [{
        _id: toManyHoursWarningInput.employeeDay._id,
        employee: {
            _id: toManyHoursWarningInput.employeeDay.employee._id
        },
        dateString: toManyHoursWarningInput.employeeDay.dateString,
        date: U.dateInUTC(toManyHoursWarningInput.employeeDay.dateString)
    }]


    /*
      I have not intentionally checked for existence of warning as duplicate warning would not cause
      much problem and any such duplicate warning would be visible on UI and duplicate calls would be
      fixed. This would save un-necessary existence check of warnings
     */

    return await WarningModel.create(warning)
}


warningSchema.statics.removeUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}

warningSchema.statics.taskReportedAsPendingOnEndDate = async (taskPlan) => {

    logger.debug('taskReportedAsPendingOnEndDate(): taskplan ', {taskPlan})
    /**
     * It is possible that this warning is raised earlier as well like when task is reported as pending again on end date by other developer or same developer
     * Check to see if release plan of this task already has this warning raised
     */

    let warning = await WarningModel.findOne({
        type: SC.WARNING_PENDING_ON_END_DATE,
        'releasePlans._id': mongoose.Types.ObjectId(taskPlan.releasePlan._id)
    })

    logger.debug('taskReportedAsPendingOnEndDate(): existing warning ', {warning})

    if (warning) {

        var taskPlanAlreadyAdded = false
        if (warning.taskPlans) {
            taskPlanAlreadyAdded = warning.taskPlans.filter(t => {
                return t._id.toString() == taskPlan._id.toString()
            }).length > 0
        }

        logger.debug('taskReportedAsPendingOnEndDate(): task plan already added [' + taskPlanAlreadyAdded + ']')
        if (!taskPlanAlreadyAdded) {
            warning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
            // since this task plan was not already add we would have to see if addition of this task plan would cause new release/releaseplan against this warning

            var releaseAlreadyAdded = false
            if (warning.releases) {
                releaseAlreadyAdded = warning.releases.filter(r => {
                    return r._id.toString() == taskPlan.release._id.toString()
                }).length > 0
            }

            logger.debug('taskReportedAsPendingOnEndDate(): release already added [' + releaseAlreadyAdded + ']')
            if (!releaseAlreadyAdded) {
                // fetch this release and add to warning
                let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
                warning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            }

            var releasePlanAlreadyAdded = false
            if (warning.releasePlans) {
                releasePlanAlreadyAdded = warning.releasePlans.filter(r => {
                    return r._id.toString() == taskPlan.releasePlan._id.toString()
                }).length > 0
            }
            logger.debug('taskReportedAsPendingOnEndDate(): release plan already added [' + releasePlanAlreadyAdded + ']')
            if (!releasePlanAlreadyAdded) {
                // As release plan not already added, fetch and add
                let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.release._id, {task: 1})
                warning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
            }
        }
        return await warning.save()

    } else {

        warning = {}
        warning.type = SC.WARNING_PENDING_ON_END_DATE

        let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
        logger.debug("taskReportedAsPendingOnEndDate(): ", {release})
        warning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
        logger.debug("taskReportedAsPendingOnEndDate(): ", {releasePlan})
        warning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        warning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
        logger.debug("taskReportedAsPendingOnEndDate():  creating warning ", {warning})
        return await WarningModel.create(warning)
    }
}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
