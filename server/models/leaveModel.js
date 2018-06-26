import mongoose from 'mongoose'
import AppError from '../AppError'
import logger from '../logger'
import * as V from "../validation"
import * as U from "../utils"
import * as EC from "../errorcodes";
import * as SC from "../serverconstants";
import * as MDL from "../models";
import _ from "lodash"

mongoose.Promise = global.Promise


let leaveSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
    status: {
        type: String,
        enum: SC.ALL_LEAVE_STATUS_ARRAY
    },
    dayType: {type: String, enum: SC.LEAVE_TYPE_DAY_ARRAY},
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
    startDateString: {type: String, required: true},
    endDate: {type: Date, required: true},
    endDateString: {type: String, required: true},
    numberOfLeaveDays: {type: Number, required: true},
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})


leaveSchema.statics.getAllLeaves = async (status, user) => {
    let leaves
    if (U.userHasRole(user, SC.ROLE_HIGHEST_MANAGEMENT_ROLE)) {
        leaves = await getLeaves(status, user)
    } else {
        leaves = await getUserLeaves(status, user)
    }

    leaves = leaves && leaves.length ? leaves.map(leave => Object.assign({}, leave.toObject(), {
        canDelete: leave.user._id.toString() === user._id.toString(),
        canCancel: _.includes([SC.LEAVE_STATUS_RAISED], leave.status) && U.userHasRole(user, SC.ROLE_HIGHEST_MANAGEMENT_ROLE),
        canApprove: _.includes([SC.LEAVE_STATUS_RAISED], leave.status) && U.userHasRole(user, SC.ROLE_HIGHEST_MANAGEMENT_ROLE)
        })
    ) : []
    return leaves
}


const getUserLeaves = async (status, user) => {

    if (status && status.toLowerCase() === 'all') {
        return await LeaveModel.find({
            "user._id": mongoose.Types.ObjectId(user._id)
        }).sort({'startDate': -1})
    } else {
        return await LeaveModel.find({
            "user._id": mongoose.Types.ObjectId(user._id),
            "status": status
        }).sort({'startDate': -1})
    }
}

const getLeaves = async (status, user) => {
    if (status && status.toLowerCase() === 'all') {
        return await LeaveModel.find({}).sort({'startDate': -1})
    } else {
        return await LeaveModel.find({
            "status": status
        }).sort({'startDate': -1})
    }
}

const makeWarningUpdatesOnRaiseLeaveRequest = async (startDateString, endDateString, user) => {
    let generatedWarnings = await MDL.WarningModel.leaveAdded(startDateString, endDateString, user)

    /*----------------------------------------------------WARNING_RESPONSE_ADDED_SECTION----------------------------------------------------------*/
    if (generatedWarnings.added && generatedWarnings.added.length) {
        generatedWarnings.added.forEach(async w => {
            if (w.type === SC.WARNING_MORE_PLANNED_HOURS) {
                /*-----------------------------------------------WARNING_MORE_PLANNED_HOURS-------------------------------------------------*/
                if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {
                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.ReleasePlanModel.findById(w._id).then(r => {
                        if (r && r.flags.indexOf(SC.WARNING_MORE_PLANNED_HOURS) === -1) {
                            r.flags.push(SC.WARNING_MORE_PLANNED_HOURS)
                            return r.save()
                        }
                    })
                } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                    logger.debug('addTaskPlanning(): warning [' + SC.WARNING_MORE_PLANNED_HOURS + '] is added against task plan with id [' + w._id + ']')


                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.TaskPlanningModel.findById(w._id).then(t => {
                        if (t && t.flags.indexOf(SC.WARNING_MORE_PLANNED_HOURS) === -1) {
                            logger.debug('Pushing  [' + SC.WARNING_MORE_PLANNED_HOURS + '] warning against task plan [' + t._id + ']')
                            t.flags.push(SC.WARNING_MORE_PLANNED_HOURS)
                            return t.save()

                        }
                    })

                }
            } else if (w.warningType === SC.WARNING_LESS_PLANNED_HOURS) {
                if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {

                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.ReleasePlanModel.findById(w._id).then(r => {
                        if (r && r.flags.indexOf(SC.WARNING_LESS_PLANNED_HOURS) === -1) {
                            r.flags.push(SC.WARNING_LESS_PLANNED_HOURS)
                            return r.save()
                        }
                    })

                } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                    logger.debug('addTaskPlanning(): warning [' + SC.WARNING_LESS_PLANNED_HOURS + '] is added against task plan with id [' + w._id + ']')

                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.TaskPlanningModel.findById(w._id).then(t => {
                        if (t && t.flags.indexOf(SC.WARNING_LESS_PLANNED_HOURS) === -1) {
                            logger.debug('Pushing  [' + SC.WARNING_LESS_PLANNED_HOURS + '] warning against task plan [' + t._id + ']')
                            t.flags.push(SC.WARNING_LESS_PLANNED_HOURS)
                            return t.save()

                        }
                    })

                }
            }
        })

    }
    if (generatedWarnings.removed && generatedWarnings.removed.length) {
        generatedWarnings.removed.forEach(async w => {
            if (w.type === SC.WARNING_MORE_PLANNED_HOURS) {
                /*-----------------------------------------------WARNING_MORE_PLANNED_HOURS-------------------------------------------------*/
                if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {
                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.ReleasePlanModel.findById(w._id).then(r => {
                        if (r && r.flags.indexOf(SC.WARNING_MORE_PLANNED_HOURS) > -1) {
                            r.flags.pull(SC.WARNING_MORE_PLANNED_HOURS)
                            return r.save()
                        }
                    })
                } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                    logger.debug('addTaskPlanning(): warning [' + SC.WARNING_MORE_PLANNED_HOURS + '] is removed against task plan with id [' + w._id + ']')
                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.TaskPlanningModel.findById(w._id).then(t => {
                        if (t && t.flags.indexOf(SC.WARNING_MORE_PLANNED_HOURS) > -1) {
                            logger.debug('Pulling  [' + SC.WARNING_MORE_PLANNED_HOURS + '] warning against task plan [' + t._id + ']')
                            t.flags.pull(SC.WARNING_MORE_PLANNED_HOURS)
                            return t.save()
                        }
                    })

                }
            } else if (w.type === SC.WARNING_LESS_PLANNED_HOURS) {
                /*-----------------------------------------------WARNING_MORE_PLANNED_HOURS-------------------------------------------------*/
                if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {
                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.ReleasePlanModel.findById(w._id).then(r => {
                        if (r && r.flags.indexOf(SC.WARNING_LESS_PLANNED_HOURS) > -1) {
                            r.flags.pull(SC.WARNING_LESS_PLANNED_HOURS)
                            return r.save()
                        }
                    })
                } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                    logger.debug('addTaskPlanning(): warning [' + SC.WARNING_LESS_PLANNED_HOURS + '] is removed against task plan with id [' + w._id + ']')
                    // this warning has affected release plan other than associated with current release plan find that release plan and add flag there as well
                    MDL.TaskPlanningModel.findById(w._id).then(t => {
                        if (t && t.flags.indexOf(SC.WARNING_LESS_PLANNED_HOURS) > -1) {
                            logger.debug('Pulling  [' + SC.WARNING_LESS_PLANNED_HOURS + '] warning against task plan [' + t._id + ']')
                            t.flags.pull(SC.WARNING_LESS_PLANNED_HOURS)
                            return t.save()
                        }
                    })
                }
            }
        })
    }

    return generatedWarnings
}

leaveSchema.statics.raiseLeaveRequest = async (leaveInput, user, schemaRequested) => {
    if (schemaRequested)
        return V.generateSchema(V.leaveRequestAdditionStruct)

    V.validate(leaveInput, V.leaveRequestAdditionStruct)


    let startDateMoment = U.momentInUTC(leaveInput.startDate)
    let endDateMoment = U.momentInUTC(leaveInput.endDate)

    if (!endDateMoment.isSameOrAfter(startDateMoment))
        throw new AppError("End date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!startDateMoment.isSameOrAfter(U.getTodayStartingMoment()))
        throw new AppError("Leave start date should be greater than or equal to today date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    if (!startDateMoment.isValid() || !endDateMoment.isValid())
        throw new AppError("Invalid Start date or End Date generated by moment", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let leaveDaysCount = endDateMoment.diff(startDateMoment, 'days')
    if (!leaveDaysCount)
        leaveDaysCount = 0

    leaveDaysCount = Number(leaveDaysCount)

    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/

    let warningResponses = await makeWarningUpdatesOnRaiseLeaveRequest(leaveInput.startDate, leaveInput.endDate, user)

    logger.debug('Leave Added warning response:  ', {warningResponses})
    let leaveType = await MDL.LeaveTypeModel.findById(mongoose.Types.ObjectId(leaveInput.leaveType._id))
    let newLeave = new LeaveModel()

    newLeave.startDate = startDateMoment
    newLeave.startDateString = leaveInput.startDate
    newLeave.endDate = endDateMoment
    newLeave.endDateString = leaveInput.endDate

    //note:- this case for current date raise leave
    newLeave.numberOfLeaveDays = leaveDaysCount + 1
    newLeave.leaveType = leaveType
    newLeave.status = SC.LEAVE_STATUS_RAISED
    newLeave.user = user
    newLeave.dayType = leaveInput.dayType ? leaveInput.dayType : SC.LEAVE_TYPE_FULL_DAY
    newLeave.description = leaveInput.description

    await newLeave.save(leaveInput)
    newLeave = newLeave.toObject()
    newLeave.canDelete = true
    newLeave.canCancel = U.userHasRole(user, SC.ROLE_HIGHEST_MANAGEMENT_ROLE)
    newLeave.canApprove = U.userHasRole(user, SC.ROLE_HIGHEST_MANAGEMENT_ROLE)
    return {leave: newLeave, warnings: warningResponses}
}

leaveSchema.statics.approveLeaveRequest = async (leaveID, reason, user) => {
    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID),)

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    /*--------------------------------------WARNING UPDATE SECTION ----------------------------------*/
    let warningResponses

    /*--------------------------------EMPLOYEE STATISTICS UPDATE SECTION---------------------------*/

    /*------------------------------------LEAVE APPROVAL SECTION----------------------------------*/

    leaveRequest.status = SC.LEAVE_STATUS_APPROVED
    leaveRequest.approver = user
    leaveRequest.approver.name = user.firstName + user.lastName
    leaveRequest.approver.reason = reason
    leaveRequest.status = SC.LEAVE_STATUS_CANCELLED
    await leaveRequest.save()

    leaveRequest = leaveRequest.toObject()
    leaveRequest.canDelete = user._id.toString() === leaveRequest.user._id.toString()
    leaveRequest.canCancel = false
    leaveRequest.canApprove = false
    return leaveRequest
}

leaveSchema.statics.cancelLeaveRequest = async (leaveID, reason, user) => {

    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let warningResponses

    /*------------------------------------LEAVE CANCELLATION SECTION----------------------------------*/
    leaveRequest.approver = user
    leaveRequest.approver.name = user.firstName + user.lastName
    leaveRequest.approver.reason = reason
    leaveRequest.status = SC.LEAVE_STATUS_CANCELLED
    await leaveRequest.save()

    leaveRequest = leaveRequest.toObject()
    leaveRequest.canDelete = user._id.toString() === leaveRequest.user._id.toString()
    leaveRequest.canCancel = false
    leaveRequest.canApprove = false

    return {leave: leaveRequest, warnings: warningResponses}
}


leaveSchema.statics.deleteLeave = async (leaveID, user) => {

    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    if (leaveRequest.user._id.toString() !== user._id.toString()) {
        throw new AppError("This leave is not belongs to your leave ,user can delete his own leave only", EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    }

    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let warningResponses

    /*------------------------------------LEAVE DELETION SECTION----------------------------------*/

    let leave = await LeaveModel.findByIdAndRemove(mongoose.Types.ObjectId(leaveID))

    return {leave: leave, warnings: warningResponses}
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel