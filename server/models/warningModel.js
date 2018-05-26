import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import * as V from '../validation'

mongoose.Promise = global.Promise

let warningSchema = mongoose.Schema({
    type: {
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_TOO_MANY_HOURS, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_RELEASE_DATE_MISSED_1, SC.WARNING_RELEASE_DATE_MISSED_2, SC.WARNING_RELEASE_DATE_MISSED_3, SC.WARNING_RELEASE_DATE_MISSED_4, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_UNREPORTED, SC.WARNING_PENDING_AFTER_END_DATE, SC.WARNING_COMPLETED_BEFORE_END_DATE]
    },
    releases: [{
        _id: mongoose.Schema.ObjectId
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId
    }],
    employeeDays: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        dateString: String
    }],
    mute: {type: Boolean, default: false}
})


warningSchema.statics.addUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // unplanned warning would be raised against a single release and a single release plan
    var warning = {}
    warning.type = SC.WARNING_UNPLANNED
    warning.releases = [{
        _id: releasePlan.release._id
    }]
    warning.releasePlans = [{
        _id: releasePlan._id
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
    return await WarningModel.remove({type: SC.WARNING_UNPLANNED, 'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)})
}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
