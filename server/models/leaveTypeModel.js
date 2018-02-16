import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {HTTP_BAD_REQUEST} from "../errorcodes";
import {NOT_FOUND} from "../errorcodes";
import {ALREADY_EXISTS} from "../errorcodes";

mongoose.Promise = global.Promise

let leaveTypesSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Leave type is required']
    },
    description: {
        type: String, required: [true, 'Leave description is required']
    },
    isDeleted: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    canHardDelete: {type: Boolean, default: false}
})

leaveTypesSchema.statics.getAllActiveLeaveTypes = async () => {
    return await LeaveTypeModel.find({isDeleted: false, isActive: true})
}

leaveTypesSchema.statics.saveLeaveType = async (leaveTypeInput) => {
    //console.log("saveLeaveType data ",leaveTypeInput)
    return await LeaveTypeModel.create(leaveTypeInput)
}

const LeaveTypeModel = mongoose.model("leaveType", leaveTypesSchema)
export default LeaveTypeModel
