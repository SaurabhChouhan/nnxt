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
    if (U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
        leaves = await getLeaves(status, user)
    } else {
        leaves = await getUserLeaves(status, user)
    }

    leaves = leaves && leaves.length ? leaves.map(leave => Object.assign({}, leave.toObject(), {
            canDelete: leave.user._id.toString() === user._id.toString(),
            canCancel: _.includes([SC.LEAVE_STATUS_RAISED], leave.status) && U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT),
            canApprove: _.includes([SC.LEAVE_STATUS_RAISED], leave.status) && U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)
        })
    ) : []
    return leaves
}


const getUserLeaves = async (status, user) => {

    if (status && status.toLowerCase() === SC.ALL) {
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
    if (status && status.toLowerCase() === SC.ALL) {
        return await LeaveModel.find({}).sort({'startDate': -1})
    } else {
        return await LeaveModel.find({
            "status": status
        }).sort({'startDate': -1})
    }
}


const updateFlags = async (generatedWarnings) => {

    // To avoid concurrency problems we would first fetch all release plan/task plans
    // that would be affected by warnings added/removed due to addition of this task plan
    // then we would update them by pushing/pulling flags
    // As a last step we would save all of them


    let releasePlanIDs = [];
    let taskPlanIDs = [];

    if (generatedWarnings.added && generatedWarnings.added.length) {
        let releasePlanWarnings = generatedWarnings.added.filter(w => w.warningType === SC.WARNING_TYPE_RELEASE_PLAN)
        let taskPlanWarnings = generatedWarnings.added.filter(w => w.warningType === SC.WARNING_TYPE_TASK_PLAN)

        releasePlanWarnings.map(w => w._id.toString()).reduce((rpIDs, wid) => {
            if (rpIDs.indexOf(wid) == -1)
                rpIDs.push(wid)
            return rpIDs
        }, releasePlanIDs)

        taskPlanWarnings.map(w => w._id.toString()).reduce((tpIDs, wid) => {
            if (tpIDs.indexOf(wid) == -1)
                tpIDs.push(wid)
            return tpIDs
        }, taskPlanIDs)

    }

    if (generatedWarnings.removed && generatedWarnings.removed.length) {
        let releasePlanWarnings = generatedWarnings.removed.filter(w => w.warningType === SC.WARNING_TYPE_RELEASE_PLAN)
        let taskPlanWarnings = generatedWarnings.removed.filter(w => w.warningType === SC.WARNING_TYPE_TASK_PLAN)

        releasePlanWarnings.map(w => w._id.toString()).reduce((rpIDs, wid) => {
            if (rpIDs.indexOf(wid) == -1)
                rpIDs.push(wid)
            return rpIDs
        }, releasePlanIDs)

        taskPlanWarnings.map(w => w._id.toString()).reduce((tpIDs, wid) => {
            if (tpIDs.indexOf(wid) == -1)
                tpIDs.push(wid)
            return tpIDs
        }, taskPlanIDs)
    }
    // Get releases and task plans

    let rpIDPromises = releasePlanIDs.map(rpID => {
        return MDL.ReleasePlanModel.findById(rpID)
    })

    let tpIDPromises = taskPlanIDs.map(tpID => {
        return MDL.TaskPlanningModel.findById(tpID)
    })

    let affectedReleasePlans = await Promise.all(rpIDPromises)
    let affectedTaskPlans = await Promise.all(tpIDPromises)

    // Now that we have got all the releasePlan/taskPlan IDs that would be affected by warning raised, we will update them accordingly
    if (generatedWarnings.added && generatedWarnings.added.length) {
        generatedWarnings.added.forEach(w => {
            if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {
                logger.debug('addTaskPlanning(): warning [' + w.type + '] is added against release plan with id [' + w._id + ']')
                let affectedReleasePlan = affectedReleasePlans.find(arp => arp._id.toString() === w._id.toString())
                if (!affectedReleasePlan)
                    return;
                if (affectedReleasePlan.flags.indexOf(w.type) === -1)
                    affectedReleasePlan.flags.push(w.type)

            } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                logger.debug('addTaskPlanning(): warning [' + w.type + '] is added against task plan with id [' + w._id + ']')
                let affectedTaskPlan = affectedTaskPlans.find(atp => atp._id.toString() === w._id.toString())
                if (!affectedTaskPlan)
                    return;
                if (affectedTaskPlan.flags.indexOf(w.type) === -1)
                    affectedTaskPlan.flags.push(w.type)
            }
        })
    }

    if (generatedWarnings.removed && generatedWarnings.removed.length) {
        generatedWarnings.removed.forEach(w => {
            if (w.warningType === SC.WARNING_TYPE_RELEASE_PLAN) {
                logger.debug('addTaskPlanning(): warning [' + w.type + '] is removed against release plan with id [' + w._id + ']')
                let affectedReleasePlan = affectedReleasePlans.find(arp => arp._id.toString() === w._id.toString())
                if (!affectedReleasePlan)
                    return;

                if (affectedReleasePlan.flags.indexOf(w.type) > -1)
                    affectedReleasePlan.flags.pull(w.type)

            } else if (w.warningType === SC.WARNING_TYPE_TASK_PLAN) {
                logger.debug('addTaskPlanning(): warning [' + w.type + '] is removed against task plan with id [' + w._id + ']')
                let affectedTaskPlan = affectedTaskPlans.find(atp => atp._id.toString() === w._id.toString())
                if (!affectedTaskPlan)
                    return;
                if (affectedTaskPlan.flags.indexOf(w.type) > -1)
                    affectedTaskPlan.flags.pull(w.type)
            }
        })
    }

    // Now that all release plans/task plans are updated to add/remove flags based on generated warnings, it is time
    // save them and then return only once all save operation completes so that user interface is appropriately modified

    let rpSavePromises = affectedReleasePlans.map(rp => {
        logger.debug("Saving release plan ", {rp})
        return rp.save()
    })

    let tpSavePromises = affectedTaskPlans.map(tp => {
        logger.debug("Saving task plan ", {tp})
        return tp.save()
    })

    await Promise.all(rpSavePromises)
    await Promise.all(tpSavePromises)

    return {
        affectedReleasePlans,
        affectedTaskPlans
    }
}

leaveSchema.statics.raiseLeaveRequest = async (leaveInput, user, schemaRequested) => {
    if (schemaRequested)
        return V.generateSchema(V.leaveRequestAdditionStruct)

    V.validate(leaveInput, V.leaveRequestAdditionStruct)


    let startDateMoment = U.momentInUTC(leaveInput.startDate)
    let endDateMoment = U.momentInUTC(leaveInput.endDate)

    if (!endDateMoment.isSameOrAfter(startDateMoment))
        throw new AppError("End date is not valid", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!startDateMoment.isSameOrAfter(U.getNowMomentInUtc()))
        throw new AppError("Leave start date should be greater than or equal to today date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    if (!startDateMoment.isValid() || !endDateMoment.isValid())
        throw new AppError("Invalid Start date or End Date generated by moment", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let leaveDaysCount = endDateMoment.diff(startDateMoment, 'days')
    if (!leaveDaysCount)
        leaveDaysCount = 0

    leaveDaysCount = Number(leaveDaysCount)
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


    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let generatedWarnings = await MDL.WarningModel.leaveAdded(leaveInput.startDate, leaveInput.endDate, user)
    let affected = await updateFlags(generatedWarnings)

    logger.debug('Leave Rised :=> warning response :  ', {generatedWarnings})
    await newLeave.save(leaveInput)
    newLeave = newLeave.toObject()
    newLeave.canDelete = true
    newLeave.canCancel = U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)
    newLeave.canApprove = U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)

    return {
        leave: newLeave,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}

const updateEmployeeStatisticsOnLeaveApprove = async (leave, requester, approver) => {


}


leaveSchema.statics.approveLeaveRequest = async (leaveID, reason, approver) => {
    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID),)

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    let requester = await MDL.UserModel.findById(mongoose.Types.ObjectId(leaveRequest.user._id))
    if (!requester) {
        throw new AppError("Requester of leave is not found ", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (_.includes([SC.LEAVE_STATUS_APPROVED], leaveRequest.status)) {
        throw new AppError("Leave has status as [" + leaveRequest.status + "]. You can only approve those leaves where status is in [" + SC.LEAVE_STATUS_RAISED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    }


    /*--------------------------------EMPLOYEE STATISTICS UPDATE SECTION---------------------------*/
    await updateEmployeeStatisticsOnLeaveApprove(leaveRequest, requester, approver)
    /*------------------------------------LEAVE APPROVAL SECTION----------------------------------*/

    leaveRequest.status = SC.LEAVE_STATUS_APPROVED
    leaveRequest.approver = approver
    leaveRequest.approver.name = approver.firstName + approver.lastName
    leaveRequest.approver.reason = reason
    await leaveRequest.save()

    /*--------------------------------------WARNING UPDATE SECTION ----------------------------------*/
    let generatedWarnings = {
        added: [],
        removed: []
    }
    let warningsLeaveApproved = await MDL.WarningModel.leaveApproved(leaveRequest.startDateString, leaveRequest.endDateString, requester, approver)

    if (warningsLeaveApproved.added && warningsLeaveApproved.added.length)
        generatedWarnings.added.push(...warningsLeaveApproved.added)
    if (warningsLeaveApproved.removed && warningsLeaveApproved.removed.length)
        generatedWarnings.removed.push(...warningsLeaveApproved.removed)

    let affected = await updateFlags(generatedWarnings)


    leaveRequest = leaveRequest.toObject()
    leaveRequest.canDelete = approver._id.toString() === requester._id.toString()
    leaveRequest.canCancel = false
    leaveRequest.canApprove = false

    return {
        leave: leaveRequest,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}


leaveSchema.statics.cancelLeaveRequest = async (leaveID, reason, user) => {

    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    if (_.includes([SC.LEAVE_STATUS_APPROVED], leaveRequest.status))
        throw new AppError("Leave has status as [" + leaveRequest.status + "]. You can only cancel those leaves where status is in [" + SC.LEAVE_STATUS_RAISED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    /*------------------------------------LEAVE CANCELLATION SECTION----------------------------------*/
    leaveRequest.approver = user
    leaveRequest.approver.name = user.firstName + user.lastName
    leaveRequest.approver.reason = reason
    leaveRequest.status = SC.LEAVE_STATUS_CANCELLED
    await leaveRequest.save()
    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let generatedWarnings = {
        added: [],
        removed: []
    }
    let warningsLeaveDeleted = await MDL.WarningModel.leaveDeleted(leaveRequest.startDateString, leaveRequest.endDateString, leaveRequest, leaveRequest.user)

    if (warningsLeaveDeleted.added && warningsLeaveDeleted.added.length)
        generatedWarnings.added.push(...warningsLeaveDeleted.added)
    if (warningsLeaveDeleted.removed && warningsLeaveDeleted.removed.length)
        generatedWarnings.removed.push(...warningsLeaveDeleted.removed)

    let affected = await updateFlags(generatedWarnings)

    leaveRequest = leaveRequest.toObject()
    leaveRequest.canDelete = user._id.toString() === leaveRequest.user._id.toString()
    leaveRequest.canCancel = false
    leaveRequest.canApprove = false

    return {
        leave: leaveRequest,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}


leaveSchema.statics.deleteLeave = async (leaveID, user) => {
    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))
    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    if (leaveRequest.user._id.toString() !== user._id.toString()) {
        throw new AppError("This leave is not belongs to your leave ,user can delete his own leave only", EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    }
    if (!_.includes([SC.LEAVE_STATUS_RAISED, SC.LEAVE_STATUS_APPROVED], leaveRequest.status))
        throw new AppError("Leave has status as [" + leaveRequest.status + "]. You can only delete those leaves where status is in [" + SC.LEAVE_STATUS_RAISED + "," + SC.LEAVE_STATUS_APPROVED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    logger.debug("leave deleted=> leave [" + leaveRequest._id + "] with user [" + user._id + "]",)
    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let generatedWarnings = {
        added: [],
        removed: []
    }
    let warningsLeaveDeleted = await MDL.WarningModel.leaveDeleted(leaveRequest.startDateString, leaveRequest.endDateString, leaveRequest, leaveRequest.user)

    if (warningsLeaveDeleted.added && warningsLeaveDeleted.added.length)
        generatedWarnings.added.push(...warningsLeaveDeleted.added)
    if (warningsLeaveDeleted.removed && warningsLeaveDeleted.removed.length)
        generatedWarnings.removed.push(...warningsLeaveDeleted.removed)

    let affected = await updateFlags(generatedWarnings)


    /*------------------------------------LEAVE DELETION SECTION----------------------------------*/
    let leave = await LeaveModel.findByIdAndRemove(mongoose.Types.ObjectId(leaveID))
    return {
        leave: leave,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel