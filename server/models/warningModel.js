import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import * as V from '../validation'

mongoose.Promise = global.Promise

let warningSchema = mongoose.Schema({
    type: {
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_TOO_MANY_HOURS, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_RELEASE_DATE_MISSED_1, SC.WARNING_RELEASE_DATE_MISSED_2, SC.WARNING_RELEASE_DATE_MISSED_3, SC.WARNING_RELEASE_DATE_MISSED_4, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_UNREPORTED, SC.WARNING_PENDING_ON_END_DATE, SC.WARNING_COMPLETED_BEFORE_END_DATE]
    },
    releases: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    employeeDays: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        dateString: String
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


warningSchema.statics.addToManyHours = async (taskPlanning) => {
    // TODO: Add appropriate validation
    // toManyHours warning would be raised against a single release and a single release plan
    var warning = {}
    warning.type = SC.WARNING_TOO_MANY_HOURS
    warning.releases = [{
        _id: mongoose.Types.ObjectId(taskPlanning.release._id)
    }]
    warning.releasePlans = [{
        _id: mongoose.Types.ObjectId(taskPlanning.releasePlan._id)
    }]
    warning.taskPlans = [{
        _id: mongoose.Types.ObjectId(taskPlanning._id)
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

warningSchema.statics.addPendingOnEndDate = async (releasePlan, taskPlan) => {
    // Find if this warning is already raised for this release plan
    let warning = await WarningModel.findOne({
        type: SC.WARNING_PENDING_ON_END_DATE,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    logger.debug('Existing warning pending on end date ', {warning})

    if (warning) {
        var releaseAlreadyAdded = false
        if (warning.releases) {
            releaseAlreadyAdded = warning.releases.filter(r => {
                return r._id.toString() == releasePlan.release._id.toString()
            }).length > 0
        }

        logger.debug('release already added ['+releaseAlreadyAdded+']')
        if (!releaseAlreadyAdded && warning.releases && warning.toObject().releases.indexOf((r) => {
                return r._id == releasePlan.release._id
            }) == -1)
            warning.releases.push({_id: releasePlan.release._id})

        var releasePlanAlreadyAdded = false
        if (warning.releasePlans) {
            releasePlanAlreadyAdded = warning.releasePlans.filter(r => {
                return r._id.toString() == releasePlan._id.toString()
            }).length > 0
        }

        logger.debug('release plan already added ['+releasePlanAlreadyAdded+']')

        if (!releasePlanAlreadyAdded && warning.releasePlans && warning.releasePlans.indexOf((r) => r._id == releasePlan._id) == -1)
            warning.releasePlans.push({_id: releasePlan._id})

        var taskPlanAlreadyAdded = false
        if (warning.taskPlans) {
            taskPlanAlreadyAdded = warning.taskPlans.filter(t => {
                return t._id.toString() == taskPlan._id.toString()
            }).length > 0
        }

        logger.debug('task plan already added ['+taskPlanAlreadyAdded+']')

        if (!taskPlanAlreadyAdded && warning.taskPlans && warning.taskPlans.indexOf((t) => t._id == taskPlan._id) == -1)
            warning.taskPlans.push({_id: taskPlan._id})

        return await warning.save()

    } else {
        warning = {}
        warning.type = SC.WARNING_PENDING_ON_END_DATE
        warning.releases = [{
            _id: releasePlan.release._id,
            source: true
        }]
        warning.releasePlans = [{
            _id: releasePlan._id,
            source: true
        }]

        warning.taskPlans = [{
            _id: taskPlan._id,
            source: true
        }]
        return await WarningModel.create(warning)
    }
}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
