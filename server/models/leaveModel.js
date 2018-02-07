import mongoose from 'mongoose'
import AppError from '../AppError'
import {STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED} from "../serverconstants";
import moment from 'moment'
mongoose.Promise = global.Promise


let leaveSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
    status: {type: String, enum: [STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED]},
    approver: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: false},
        reason: {type: String, required: false}
    },
    leave: {
        type: {type: String, required: true},
        description: {type: String, required: false},
        createdDate: {type: Date, default: Date.now()},
        from: {type: Date, required: true},
        to: {type: Date, required: true},
        numberOfLeaveDays: {type: Number, required: true}
    },
    isDeleted: {type: Boolean, default: false}
})


leaveSchema.statics.saveLeave = async (leaveInput) => {
    let leaveStartDate = moment(leaveInput.leave.from, "DD.MM.YYYY");
    let leaveEndDate = moment(leaveInput.leave.to, "DD.MM.YYYY");
    let leaveDaysCount = leaveEndDate.diff(leaveStartDate, 'days');
    leaveInput.status = STATUS_PENDING
    leaveInput.leave.numberOfLeaveDays = leaveDaysCount
    return await LeaveModel.create(leaveInput)
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel