import mongoose from 'mongoose'
import AppError from '../AppError'
import moment from 'moment'
import * as EC from "../errorcodes";
import * as SC from "../serverconstants";
import {userHasRole} from "../utils";
import {LeaveTypeModel} from "../models";

mongoose.Promise = global.Promise


let leaveSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
    status: {type: String, enum: [SC.STATUS_PENDING, SC.STATUS_APPROVED, SC.STATUS_REJECTED, SC.STATUS_CANCELLED]},
    dayType: {type: String, enum: [SC.LEAVE_TYPE_FULL_DAY, SC.LEAVE_TYPE_HALF_DAY]},
    approver: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: false},
        reason: {type: String, required: false}
    },
    leaveType: {
        _id: mongoose.Schema.ObjectId,
         name: {type: String, required: false}
     },
    description: {type: String, required: false},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    numberOfLeaveDays: {type: Number, required: true},
    isDeleted: {type: Boolean, default: false},
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})


leaveSchema.statics.saveLeave = async (leaveInput,user) => {

    console.log("leaveInput ",leaveInput)
    const leaveType = await LeaveTypeModel.findById(leaveInput.leaveType._id)
    if(!leaveType)
        throw new AppError("Leave type not fount", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let startDate =  leaveInput.startDate
    let endDate = leaveInput.endDate


    let startDateMoment  = moment(startDate,'MM-DD-YYYY')
    let endDateMoment = moment(endDate,'MM-DD-YYYY')

    console.log("startDateMoment ",startDateMoment)
    console.log("endDateMoment ",endDateMoment)

    if(!moment().isBefore(startDateMoment))
        throw new AppError("Start date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if(!moment().isBefore(endDateMoment))
        throw new AppError("End date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    if(startDateMoment > endDateMoment)
        throw new AppError("Leave start date is gretter then End date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let leaveDaysCount =  endDateMoment.diff(startDateMoment, 'days')
    if(!leaveDaysCount)
        leaveDaysCount = 0

    if(leaveDaysCount == 0)
        //note:- this case for current date raise leave
        leaveDaysCount = 1

    console.log("leaveDaysCount ",leaveDaysCount)
    leaveInput.startDate = startDateMoment
    leaveInput.endDate = endDateMoment
    leaveInput.numberOfLeaveDays = leaveDaysCount
    leaveInput.leaveType = leaveType
    leaveInput.status = SC.STATUS_PENDING
    leaveInput.user = user
    if(!leaveInput.dayType)
        leaveInput.dayType = SC.LEAVE_TYPE_FULL_DAY

    return await LeaveModel.create(leaveInput)
}

leaveSchema.statics.getAllActive = async (loggedInUser) => {

    return await LeaveModel.find({"user._id": loggedInUser._id}).exec()
}

leaveSchema.statics.cancelLeaveRequest = async (inputLeaveRequest) => {
    console.log("check the leave request Input data", inputLeaveRequest)
    let leaveRequest = await LeaveModel.findById(inputLeaveRequest._id)

    if (!leaveRequest) {
        throw new AppError("leave reqest Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    leaveRequest.status = SC.STATUS_CANCELLED
    return await leaveRequest.save()
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel