import mongoose from 'mongoose'
import AppError from '../AppError'
import {STATUS_APPROVED, STATUS_CANCELLED, STATUS_PENDING, STATUS_REJECTED} from "../serverconstants";
import moment from 'moment'
import * as EC from "../errorcodes";
import * as SC from "../serverconstants";
import {userHasRole} from "../utils";
import ProjectModel from "./projectModel";
import {ALREADY_EXISTS} from "../errorcodes";
import {HTTP_BAD_REQUEST} from "../errorcodes";
import {NOT_FOUND} from "../errorcodes";

mongoose.Promise = global.Promise


let leaveSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
    status: {type: String, enum: [STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, STATUS_CANCELLED]},
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

    let leaveStartDate = moment(leaveInput.leave.from, "DD/MM/YYYY");
    let leaveEndDate = moment(leaveInput.leave.to, "DD/MM/YYYY");
    let leaveDaysCount = leaveEndDate.diff(leaveStartDate, 'days');
    console.log("leaveDaysCount ..",leaveDaysCount)
    leaveInput.status = STATUS_PENDING
    leaveInput.leave.numberOfLeaveDays = leaveDaysCount
    console.log("save leave..",leaveInput)
    return await LeaveModel.create(leaveInput)
}

leaveSchema.statics.getAllActive = async (loggedInUser) => {

    return await LeaveModel.find({"user._id": loggedInUser._id}).exec()
}

leaveSchema.statics.cancelLeaveRequest = async (inputLeaveRequest) => {
    console.log("check the leave request Input data", inputLeaveRequest)
    let leaveRequest = await LeaveModel.findById(inputLeaveRequest._id)

    if (!leaveRequest) {
        throw new AppError("leave reqest Not Found", NOT_FOUND, HTTP_BAD_REQUEST)
    }

    leaveRequest.status = STATUS_CANCELLED
    return await leaveRequest.save()
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel