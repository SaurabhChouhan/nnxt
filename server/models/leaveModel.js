import * as EC from "../errorcodes";
import * as SC from "../serverconstants";
import * as MDL from "../models";
import mongoose from 'mongoose'
import moment from 'moment'
import AppError from '../AppError'
import * as V from "../validation"
import momentTZ from 'moment-timezone'

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


leaveSchema.statics.saveLeave = async (leaveInput, user, schemaRequested) => {
    if (schemaRequested)
        return V.generateSchema(V.leaveRequestAdditionStruct)

    V.validate(leaveInput, V.leaveRequestAdditionStruct)

    const leaveType = await MDL.LeaveTypeModel.findById(mongoose.Types.ObjectId(leaveInput.leaveType._id))
    if (!leaveType)
        throw new AppError("Leave type not fount", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    let now = new Date()
    let nowString = moment(now).format(SC.DATE_FORMAT)
    let nowMoment = momentTZ.tz(nowString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    let startDateString = moment(leaveInput.startDate).format(SC.DATE_FORMAT)
    let endDateString = moment(leaveInput.endDate).format(SC.DATE_FORMAT)

    let startDateMoment = momentTZ.tz(startDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let endDateMoment = momentTZ.tz(endDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    if (!startDateMoment.isValid() || !endDateMoment.isValid())
        throw new AppError("Invalid Start date or End Date generated by moment", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    /*  if (!startDateMoment.isAfter(nowMoment))
        throw new AppError("Start date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
  */
    if (!endDateMoment.isSameOrAfter(startDateMoment))
        throw new AppError("End date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!startDateMoment.isSameOrAfter(nowMoment))
        throw new AppError("Leave start date should be greater than or equal to today date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    console.log("leave diff", endDateMoment.diff(startDateMoment, 'days'))

    let leaveDaysCount = endDateMoment.diff(startDateMoment, 'days')
    if (!leaveDaysCount)
        leaveDaysCount = 0

    leaveDaysCount = Number(leaveDaysCount)
    leaveInput.startDate = startDateMoment
    leaveInput.endDate = endDateMoment
    //note:- this case for current date raise leave
    leaveInput.numberOfLeaveDays = leaveDaysCount + 1
    leaveInput.leaveType = leaveType
    leaveInput.status = SC.STATUS_PENDING
    leaveInput.user = user
    if (!leaveInput.dayType)
        leaveInput.dayType = SC.LEAVE_TYPE_FULL_DAY

    return await LeaveModel.create(leaveInput)
}

leaveSchema.statics.getAllActive = async (loggedInUser) => {

    return await LeaveModel.find({"user._id": loggedInUser._id}).exec()
}

leaveSchema.statics.cancelLeaveRequest = async (inputLeaveRequest) => {
    let leaveRequest = await LeaveModel.findById(inputLeaveRequest._id)

    if (!leaveRequest) {
        throw new AppError("leave reqest Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    leaveRequest.status = SC.STATUS_CANCELLED
    return await leaveRequest.save()
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel