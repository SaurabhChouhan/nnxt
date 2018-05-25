import mongoose from 'mongoose';
import AppError from '../AppError';
import * as EC from '../errorcodes';
import * as SC from '../serverconstants';

mongoose.Promise = global.Promise;

let warningSchema = mongoose.Schema({
    type: {type: String, enum: [SC.WARNING_TYPE_RELEASE, SC.WARNING_TYPE_RELEASE_TASK, SC.WARNING_TYPE_TASK_PLAN]},
    warningType: {
        type: String,
        enum: [SC.WARNING_UNPLANNED, SC.WARNING_TOO_MANY_HOURS, SC.WARNING_EMPLOYEE_ON_LEAVE, SC.WARNING_RELEASE_DATE_MISSED_1, SC.WARNING_RELEASE_DATE_MISSED_2, SC.WARNING_RELEASE_DATE_MISSED_3, SC.WARNING_RELEASE_DATE_MISSED_4, SC.WARNING_LESS_PLANNED_HOURS, SC.WARNING_MORE_PLANNED_HOURS, SC.WARNING_MORE_REPORTED_HOURS_1, SC.WARNING_MORE_REPORTED_HOURS_2, SC.WARNING_MORE_REPORTED_HOURS_3, SC.WARNING_MORE_REPORTED_HOURS_4, SC.WARNING_HAS_UNREPORTED_DAYS, SC.WARNING_UNREPORTED, SC.WARNING_PENDING_AFTER_END_DATE, SC.WARNING_COMPLETED_BEFORE_END_DATE]
    },
    refID: mongoose.Schema.ObjectId // can be a release/release task or task plan id
});

const WarningModel = mongoose.model("Warning", warningSchema);
export default WarningModel;
