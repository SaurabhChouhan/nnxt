import mongoose from 'mongoose';
import AppError from '../AppError';
import * as EC from '../errorcodes';
import * as SC from '../serverconstants';
import * as V from '../validation';

mongoose.Promise = global.Promise;

let warningSchema = mongoose.Schema({
    raisedFor: {type: String, enum: [SC.WARNING_TYPE_RELEASE, SC.WARNING_TYPE_RELEASE_TASK, SC.WARNING_TYPE_TASK_PLAN]},
    type: {
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_TOO_MANY_HOURS, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_RELEASE_DATE_MISSED_1, SC.WARNING_RELEASE_DATE_MISSED_2, SC.WARNING_RELEASE_DATE_MISSED_3, SC.WARNING_RELEASE_DATE_MISSED_4, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_UNREPORTED, SC.WARNING_PENDING_AFTER_END_DATE, SC.WARNING_COMPLETED_BEFORE_END_DATE]
    },
    refID: mongoose.Schema.ObjectId // can be a release/release task or task plan id
});

warningSchema.statics.exists = async (warning) => {
    if (!warning || !warning.raisedFor || !warning.type || !warning.refID)
        throw new AppError("Require fully populated warning object", EC.BAD_ARGUMENTS);
    let count = await WarningModel.count({
        'raisedFor': warning.raisedFor,
        'type': warning.type,
        'refID': mongoose.Types.ObjectId(warning.refID)
    });
    if (count > 0)
        return true;
    return false;
};


warningSchema.statics.addWarning = async (warningInput) => {
    V.validate(warningInput, V.warningAddStruct);

    // if warning exists don't add it just returns as not need add more warnings of same type 
    if(exists(warningInput))
        return warningInput;
    return await WarningModel.create(warningInput);
};


const WarningModel = mongoose.model("Warning", warningSchema);
export default WarningModel;
