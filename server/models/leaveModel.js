import mongoose from 'mongoose'
import AppError from '../AppError'
import logger from '../logger'
import * as V from "../validation"
import * as U from "../utils"
import * as EC from "../errorcodes";
import * as SC from "../serverconstants";
import * as MDL from "../models";
import _ from "lodash"
import moment from 'moment'
import NotificationUtil from '../notifications/byemail/notificationUtil'

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
    updated: {type: Date, default: Date.now()},
    isLastMinuteLeave: {type: Boolean, default: false}
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
        //logger.debug("Saving release plan ", {rp})
        return rp.save()
    })

    let tpSavePromises = affectedTaskPlans.map(tp => {
        //logger.debug("Saving task plan ", {tp})
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

    if (!startDateMoment.isValid() || !endDateMoment.isValid())
        throw new AppError("Invalid start/end date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!endDateMoment.isSameOrAfter(startDateMoment))
        throw new AppError("Leave end date cannot be before start date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let startDateIndia = U.momentInTimeZone(leaveInput.startDate, SC.INDIAN_TIMEZONE)

    if (!startDateIndia.isSameOrAfter(U.getPastMidNight(SC.INDIAN_TIMEZONE)))
        throw new AppError("Leave start date should be greater than or equal to today's date", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let countLeave = await MDL.LeaveModel.count({
        $and: [
            {"user._id": user._id},
            {startDate: {$lte: endDateMoment.toDate()}},
            {endDate: {$gte: startDateMoment.toDate()}},
            {status: {$in: [SC.LEAVE_STATUS_RAISED, SC.LEAVE_STATUS_APPROVED]}}
        ]
    })

    if (countLeave > 0) {
        throw new AppError("Leave dates conflicts with other raised/approved leave", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    let leaveDaysCount = endDateMoment.diff(startDateMoment, 'days')
    if (!leaveDaysCount)
        leaveDaysCount = 0


    let employeeSetting = await MDL.EmployeeSettingModel.getEmployeeSettings()


    leaveDaysCount = Number(leaveDaysCount)
    let leaveType = await MDL.LeaveTypeModel.findById(mongoose.Types.ObjectId(leaveInput.leaveType._id))
    let newLeave = new LeaveModel()
    newLeave.startDate = startDateMoment.toDate()
    newLeave.startDateString = leaveInput.startDate
    newLeave.endDate = endDateMoment.toDate()
    newLeave.endDateString = leaveInput.endDate

    let diffLeaveFromToday = startDateMoment.diff(moment(), 'days')
    logger.debug("raiseLeaveRequest ", {diffLeaveFromToday})
    logger.debug("raiseLeaveRequest ", {urgentLeaveDiff: employeeSetting.urgentLeaveDiff})

    if (diffLeaveFromToday <= employeeSetting.urgentLeaveDiff)
        newLeave.isLastMinuteLeave = true

    //note:- this case for current date raise leave
    newLeave.numberOfLeaveDays = leaveDaysCount + 1
    newLeave.leaveType = leaveType
    newLeave.status = SC.LEAVE_STATUS_RAISED
    newLeave.user = user
    newLeave.dayType = leaveInput.dayType ? leaveInput.dayType : SC.LEAVE_TYPE_FULL_DAY
    newLeave.description = leaveInput.description


    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let generatedWarnings = await MDL.WarningModel.leaveRaised(newLeave, startDateMoment.toDate(), endDateMoment.toDate(), user)
    let affected = await updateFlags(generatedWarnings)

    logger.debug('LeaveModel.leaveRaised():  ', {generatedWarnings})
    await newLeave.save(leaveInput)
    newLeave = newLeave.toObject()
    newLeave.canDelete = true
    newLeave.canCancel = U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)
    newLeave.canApprove = U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)

    let userNNXTAdmin = await MDL.UserModel.findOne({name : SC.ROLE_ADMIN})
    let emailData = {
        user:userNNXTAdmin,
        startDate:leaveInput.startDate,
        endDate:leaveInput.endDate,
        leaveType:leaveType.name,
        leaveDescription:leaveInput.description
    }
    NotificationUtil.sendNotification(emailData,SC.RAISE_LEAVE_TEMPLATE)

    return {
        leave: newLeave,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}

const updateEmployeeStatisticsOnLeaveApprove = async (leave, requester, approver) => {
    /*  let startDateMoment = U.momentInUTC(leave.startDateString)
      let endDateMoment = U.momentInUTC(leave.endDateString)
      let singleDateMoment = startDateMoment.clone()
      let employeeStatisticsOfEmployee = await MDL.EmployeeStatisticsModel.findOne({
          'employee._id': requester._id,
      })
      if (employeeStatisticsOfEmployee) {
          while (singleDateMoment.isSameOrBefore(endDateMoment)) {
              let esIdx = employeeStatisticsOfEmployee.leaves && employeeStatisticsOfEmployee.leaves.length > 0 ? employeeStatisticsOfEmployee.leaves.findIndex(l => U.momentInUTC(l.dateString).isSame(singleDateMoment)) : -1
              if (esIdx == -1) {
                  employeeStatisticsOfEmployee.leaves.push({
                      date: singleDateMoment.toDate(),
                      dateString: U.formatDateInUTC(singleDateMoment.toDate()),
                      reason: [{
                          type: String,
                          enum: [SC.REASON_MEDICAL, SC.REASON_PERSONAL, SC.REASON_OCCASION, SC.REASON_FESTIVAL]
                      }],
                      plannedHours: {type: Number, default: 0},
                      isLastMinuteLeave: {type: Boolean, default: false},
                  })
              }

              singleDateMoment = singleDateMoment.add(1, 'days')
          }
          return await employeeStatisticsOfEmployee.save()
      } else {
          let newEmployeeStatisticsOfEmployee = new MDL.EmployeeStatisticsModel()
          newEmployeeStatisticsOfEmployee.employee = {}
          newEmployeeStatisticsOfEmployee.employee._id = requester._id
          newEmployeeStatisticsOfEmployee.employee.name = requester.firstName + ' ' + requester.lastName
          newEmployeeStatisticsOfEmployee.leaves = []

          while (singleDateMoment.isSameOrBefore(endDateMoment)) {
              employeeStatisticsOfEmployee.leaves.push({
                  date: singleDateMoment.toDate(),
                  dateString: U.formatDateInUTC(singleDateMoment.toDate()),
                  reason: [{
                      type: String,
                      enum: [SC.REASON_MEDICAL, SC.REASON_PERSONAL, SC.REASON_OCCASION, SC.REASON_FESTIVAL]
                  }],
                  plannedHours: {type: Number, default: 0},
                  isLastMinuteLeave: {type: Boolean, default: false},
              })

              singleDateMoment = singleDateMoment.add(1, 'days')
          }
          return await newEmployeeStatisticsOfEmployee.save()
      }
  */
}

const updateEmployeeReleaseApproveLeave = async (releases, leave) => {

    for (const release of releases) {
        // Find out employee release there should only be one employee release
        let employeeRelease = await MDL.EmployeeReleasesModel.findOne({
            "employee._id": leave.user._id,
            "release._id": release._id
        })

        if (employeeRelease) {
            logger.debug("updateEmployeeReleaseApproveLeave(): ", {employeeRelease})
            // Now we would calculate sum of all tasks on leave date range
            let sumResult = await MDL.TaskPlanningModel.aggregate({
                $match: {
                    $and: [
                        {'planningDate': {$gte: leave.startDate}},
                        {'planningDate': {$lte: leave.endDate}}
                    ],
                    'employee._id': mongoose.Types.ObjectId(leave.user._id),
                    'release._id': mongoose.Types.ObjectId(release._id)
                }
            }, {
                $group: {
                    _id: null,
                    sumPlannedHours: {$sum: '$planning.plannedHours'}
                }
            })

            if (sumResult && sumResult.length) {
                employeeRelease.leaves.plannedHoursOnLeave += sumResult[0].sumPlannedHours
            }

            if (leave.isLastMinuteLeave)
                employeeRelease.leaves.plannedHoursLastMinuteLeave += sumResult[0].sumPlannedHours

            await employeeRelease.save()

            logger.debug("updateEmployeeReleaseApproveLeave(): ", {sumResult})

        } else {
            throw AppError('Employee release should be found for this release/employee combination ', EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)
        }
    }
}

leaveSchema.statics.approveLeave = async (leaveID, reason, approver) => {
    let leave = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leave) {
        throw new AppError("Leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    let employee = await MDL.UserModel.findById(mongoose.Types.ObjectId(leave.user._id))

    if (!employee) {
        throw new AppError("Requester of leave not found ", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (_.includes([SC.LEAVE_STATUS_APPROVED], leave.status)) {
        throw new AppError('Leave already approved', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    /*--------------------------------EMPLOYEE RELEASE UPDATES---------------------------*/

    // Find out all the release IDs that this leave has impact on
    let associatedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
        $and: [
            {'planningDate': {$gte: leave.startDate}},
            {'planningDate': {$lte: leave.endDate}}
        ],
        'employee._id': mongoose.Types.ObjectId(leave.user._id)
    })

    if (associatedReleaseIDs && associatedReleaseIDs.length) {
        // Iterate over all associated releases and calculate employee releases
        let releases = await MDL.ReleaseModel.getReleasesByIDs(associatedReleaseIDs)
        await updateEmployeeReleaseApproveLeave(releases, leave)
    }

    /*------------------------------------LEAVE APPROVAL SECTION----------------------------------*/

    leave.status = SC.LEAVE_STATUS_APPROVED
    leave.approver = approver
    leave.approver.name = U.getFullName(approver)
    leave.approver.reason = reason
    await leave.save()

    /*--------------------------------------WARNING UPDATE SECTION ----------------------------------*/
    let generatedWarnings = {
        added: [],
        removed: []
    }
    let warningsLeaveApproved = await MDL.WarningModel.leaveApproved(leave)

    logger.debug("WarningModel.leaveApproved(): ", {warningsLeaveApproved})

    if (warningsLeaveApproved.added && warningsLeaveApproved.added.length)
        generatedWarnings.added.push(...warningsLeaveApproved.added)
    if (warningsLeaveApproved.removed && warningsLeaveApproved.removed.length)
        generatedWarnings.removed.push(...warningsLeaveApproved.removed)

    let affected = await updateFlags(generatedWarnings)

    leave = leave.toObject()
    leave.canDelete = approver._id.toString() === employee._id.toString()
    leave.canCancel = false
    leave.canApprove = false

    let emailData = {
        user:user,
        reason:reason
    }
    NotificationUtil.sendNotification(emailData,SC.APPROVED_LEAVE_TEMPLATE)

    return {
        leave: leave,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}


leaveSchema.statics.rejectLeave = async (leaveID, reason, user) => {

    let leaveRequest = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leaveRequest) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    if (!_.includes([SC.LEAVE_STATUS_RAISED], leaveRequest.status))
        throw new AppError("Leave has status as [" + leaveRequest.status + "]. You can only reject those leaves where status is in [" + SC.LEAVE_STATUS_RAISED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

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
    let warningsLeaveDeleted = await MDL.WarningModel.leaveRevoked(leaveRequest)

    if (warningsLeaveDeleted.added && warningsLeaveDeleted.added.length)
        generatedWarnings.added.push(...warningsLeaveDeleted.added)
    if (warningsLeaveDeleted.removed && warningsLeaveDeleted.removed.length)
        generatedWarnings.removed.push(...warningsLeaveDeleted.removed)

    let affected = await updateFlags(generatedWarnings)

    leaveRequest = leaveRequest.toObject()
    leaveRequest.canDelete = user._id.toString() === leaveRequest.user._id.toString()
    leaveRequest.canCancel = false
    leaveRequest.canApprove = false

    let emailData = {
        user:user,
        reason:reason
    }
    NotificationUtil.sendNotification(emailData,SC.REJECT_RAISED_LEAVE_TEMPLATE)

    return {
        leave: leaveRequest,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}

const updateEmployeeReleaseRevokeLeave = async (releases, leave) => {

    for (const release of releases) {
        // Find out employee release there should only be one employee release
        let employeeRelease = await MDL.EmployeeReleasesModel.findOne({
            "employee._id": leave.user._id,
            "release._id": release._id
        })

        if (employeeRelease) {
            logger.debug("updateEmployeeReleaseRevokeLeave(): ", {employeeRelease})
            // Now we would calculate sum of all tasks on leave date range
            let sumResult = await MDL.TaskPlanningModel.aggregate({
                $match: {
                    $and: [
                        {'planningDate': {$gte: leave.startDate}},
                        {'planningDate': {$lte: leave.endDate}}
                    ],
                    'employee._id': mongoose.Types.ObjectId(leave.user._id),
                    'release._id': mongoose.Types.ObjectId(release._id)
                }
            }, {
                $group: {
                    _id: null,
                    sumPlannedHours: {$sum: '$planning.plannedHours'}
                }
            })

            if (sumResult && sumResult.length) {
                employeeRelease.leaves.plannedHoursOnLeave -= sumResult[0].sumPlannedHours
            }

            if (leave.isLastMinuteLeave)
                employeeRelease.leaves.plannedHoursLastMinuteLeave -= sumResult[0].sumPlannedHours

            await employeeRelease.save()

            logger.debug("updateEmployeeReleaseRevokeLeave(): ", {sumResult})

        } else {
            throw AppError('Employee release should be found for this release/employee combination ', EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)
        }
    }
}

leaveSchema.statics.revokeLeave = async (leaveID, user) => {
    let leave = await LeaveModel.findById(mongoose.Types.ObjectId(leaveID))

    if (!leave) {
        throw new AppError("leave request Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (leave.user._id.toString() !== user._id.toString()) {
        throw new AppError("Leave do not belongs to you, cannot delete!", EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    }

    // Leave can only be deleted one day prior to its start

    let pastMidnightIndia = U.getPastMidNight(SC.INDIAN_TIMEZONE)
    let startDateInIndia = U.momentInTimeZone(leave.startDateString, SC.INDIAN_TIMEZONE)

    if (!startDateInIndia.isAfter(pastMidnightIndia) && _.includes([SC.LEAVE_STATUS_APPROVED], leave.status))
        throw new AppError("Can remove approved leave upto 1 day prior to their start date", EC.TIME_OVER, EC.HTTP_BAD_REQUEST)


    /*--------------------------------EMPLOYEE RELEASE UPDATES---------------------------*/

    if(leave.status == SC.LEAVE_STATUS_APPROVED){
        // Revoking leave request after its approval would change employee release leave statistics

        // Find out all the release IDs that this leave has impact on
        let associatedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
            $and: [
                {'planningDate': {$gte: leave.startDate}},
                {'planningDate': {$lte: leave.endDate}}
            ],
            'employee._id': mongoose.Types.ObjectId(leave.user._id)
        })

        if (associatedReleaseIDs && associatedReleaseIDs.length) {
            // Iterate over all associated releases and calculate employee releases
            let releases = await MDL.ReleaseModel.getReleasesByIDs(associatedReleaseIDs)
            await updateEmployeeReleaseRevokeLeave(releases, leave)
        }
    }



    /*--------------------------------WARNING UPDATE SECTION ----------------------------------------*/
    let generatedWarnings = {
        added: [],
        removed: []
    }
    let warningsLeaveRevoked = await MDL.WarningModel.leaveRevoked(leave)

    logger.debug("leaveModel.leaveRevoked(): ", {warningsLeaveRevoked})

    if (warningsLeaveRevoked.added && warningsLeaveRevoked.added.length)
        generatedWarnings.added.push(...warningsLeaveRevoked.added)
    if (warningsLeaveRevoked.removed && warningsLeaveRevoked.removed.length)
        generatedWarnings.removed.push(...warningsLeaveRevoked.removed)

    let affected = await updateFlags(generatedWarnings)
    /*------------------------------------LEAVE DELETION SECTION----------------------------------*/
    await leave.remove()

    return {
        leave: leave,
        warnings: generatedWarnings,
        affectedReleasePlans: affected.affectedReleasePlans,
        affectedTaskPlans: affected.affectedTaskPlans
    }
}

const LeaveModel = mongoose.model("Leave", leaveSchema)
export default LeaveModel