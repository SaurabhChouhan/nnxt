import mongoose from 'mongoose'
import logger from '../logger'
import _ from 'lodash'
import AppError from '../AppError'
import * as MDL from '../models'
import * as SC from '../serverconstants'
import * as U from '../utils'
import * as EC from '../errorcodes'

mongoose.Promise = global.Promise


/**
 * Source - This is true for release/releaseplan/taskplan when they are the cause of this warning. Other reelease/releaseplan/taskplan with source as false
 * are those that are affected by that warning but have not contributed to that warning
 *
 * isUnresolvable - Some warning cannot be resolved using any action like 'Release date missed' cannot be resolved because no action would make that warning
 * go.
 *
 *
 */

let warningSchema = mongoose.Schema({
    type: {
        type: String,
        enum: SC.ALL_WARNING_NAME_ARRAY
    },
    isUnresolvable: {type: Boolean, default: false},
    releases: [{
        _id: mongoose.Schema.ObjectId,
        name: {type: String},
        project: {
            name: {type: String, required: [true, 'Project name is required']}
        },
        source: {type: Boolean, default: false}
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        task: {
            name: {type: String, required: [true, 'Task name is required']}
        },
        source: {type: Boolean, default: false}
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId,
        release: {
            _id: mongoose.Schema.ObjectId,
        },
        releasePlan: {
            _id: mongoose.Schema.ObjectId,
        },
        source: {type: Boolean, default: false}
    }],
    employeeDays: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        dateString: String,
        date: {type: Date, default: Date.now()},
    }],
    raisedOn: {type: Date, default: Date.now()},
    mute: {type: Boolean, default: false}
}, {
    usePushEach: true
})


/*-------------------------------------------------------------------GET_WARNINGS_SECTION_START---------------------------------------------------------------------*/
warningSchema.statics.getWarnings = async (releaseID, warningType, user) => {
    //
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID))
    if (!release) {
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    // Get all roles user have in this release
    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInThisRelease(release._id, user)
    logger.debug('warningModel.getWarnings(): ', {userRolesInThisRelease})
    if (!userRolesInThisRelease) {
        throw new AppError('User is not having any role in this release so don`t have any access', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    if (!_.includes(SC.ROLE_LEADER, userRolesInThisRelease) && !_.includes(SC.ROLE_MANAGER, userRolesInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can see warnings of any release', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    let filter = []
    filter = {'releases._id': releaseID}
    if (warningType && warningType.toLowerCase() !== 'all')
        filter = {'releases._id': releaseID, 'type': warningType}

    return await WarningModel.find(filter)
}

/*-------------------------------------------------------------------ADD_UNPLANNED_SECTION_START---------------------------------------------------------------------*/


warningSchema.statics.addUnplanned = async (release, releasePlan) => {
    // unplanned warning would be raised against a single release and a single release plan
    let warning = {}
    warning.type = SC.WARNING_UNPLANNED
    warning.releases = [Object.assign({}, release.toObject(), {
        source: true
    })],
        warning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
            source: true
        })],
        warning.taskPlans = []
    /*
      I have not intentionally checked for existence of warning as duplicate warning would not cause
      much problem and any such duplicate warning would be visible on UI and duplicate calls would be
      fixed. This would save un-necessary existence check of warnings
     */
    return await WarningModel.create(warning)
}

/*-------------------------------------------------------------------ADD_UNPLANNED_SECTION_END---------------------------------------------------------------------*/


/*-------------------------------------------------------------------REMOVED_UNPLANNED_SECTION_START-----------------------------------------------------------------*/

warningSchema.statics.removeUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}

/*-------------------------------------------------------------------REMOVED_UNPLANNED_SECTION_END-----------------------------------------------------------------*/


/*-------------------------------------------------------------------TASK_REPORTED_SECTION_START----------------------------------------------------------*/

/**
 * Called when any task is reported
 */
warningSchema.statics.taskReported = async (taskPlan, releasePlan, release) => {

    // console.log("taskPlanReported called.. release "+JSON.stringify(release))
    let releasePlanWarnings = await WarningModel.findOne({
        $and: [{
            $or: [{type: SC.WARNING_MORE_REPORTED_HOURS_1},
                {type: SC.WARNING_MORE_REPORTED_HOURS_2},
                {type: SC.WARNING_MORE_REPORTED_HOURS_3},
                {type: SC.WARNING_MORE_REPORTED_HOURS_4}]
        },
            {'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)}]
    })
    console.log("releasePlanWarnings.." + releasePlanWarnings)
    let warningResponse = {
        added: [],
        removed: []
    }
    let addedType
    let removedType
    if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 4)) {
        // Need to add WARNING_MORE_REPORTED_HOURS_4
        if (releasePlanWarnings && releasePlanWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_4) {
            removedType = releasePlanWarnings.type
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_4
    } else if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 2)) {
        // Need to add WARNING_MORE_REPORTED_HOURS_3
        if (releasePlanWarnings && releasePlanWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_3) {
            removedType = releasePlanWarnings.type;
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_3
    } else if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 1.5)) {
        // Need to add WARNING_MORE_REPORTED_HOURS_2
        if (releasePlanWarnings && releasePlanWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_2) {
            removedType = releasePlanWarnings.type;
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_2
    }
    else if (releasePlan.report.reportedHours > releasePlan.task.estimatedHours) {
        // Need to add WARNING_MORE_REPORTED_HOURS_1
        if (releasePlanWarnings && releasePlanWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_1) {
            removedType = releasePlanWarnings.type
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_1
    }
    else {
        // no warning found so just need to remove if old warning available
        if (releasePlanWarnings)
            removedType = releasePlanWarnings.type;
    }

    if (addedType) {
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: addedType
        })
    }

    if (removedType) {
        warningResponse.removed.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: removedType
        })
    }

    if (releasePlanWarnings) {
        // warningResponse.removed.push(releasePlanWarnings)
        if (addedType) {
            console.log("Need to update  warning as it is  available in warning model");
            releasePlanWarnings.type = addedType
            await releasePlanWarnings.save()
        } else {
            // Need to remove warning as reported hour updated (reportedHour<estimatedHour)
            console.log("Need to remove warning as reported hour updated (reportedHour<estimatedHour)");
            await await WarningModel.findByIdAndRemove(mongoose.Types.ObjectId(releasePlanWarnings._id))
        }
    } else {
        console.log("Need to add new warning as it is not available in warning model");


        let moreHoursWarning = new WarningModel()

        moreHoursWarning.type = addedType
        //moreHoursWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: false})]
        moreHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        moreHoursWarning.releases = [Object.assign({}, release.toObject(), {source: false})]
        //  newTooManyHoursWarning.employeeDays = [...employeeDays]
        await moreHoursWarning.save()
    }

    console.log("Release plan warnings " + JSON.stringify(warningResponse));

    return warningResponse
}


/*-------------------------------------------------------------------TASK_REPORTED_SECTION_END----------------------------------------------------------*/


/*-------------------------------------------------------------------DELETE_WARNING_WITH_RESPONSE_SECTION_START----------------------------------------------------------*/


/*
This is generic method that can be used to delete any warning, this method would then return appropriate warnings that are
removed due to this deletion

 */
const deleteWarningWithResponse = async (warning, warningType) => {

    let warningResponse = {
        added: [],
        removed: []
    }
    warning.taskPlans.forEach(tp => {
        if (tp) {
            warningResponse.removed.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: warningType,
                source: tp.source
            })
        }
    })
    warning.releasePlans.forEach(async rp => {
        let releaseWarningCount = await WarningModel.count({
            type: warningType,
            'releasePlans._id': rp._id
        })

        /*
           Although warning may be removed from a particular date of release plan but it is possible
           that warning still exists on other dates of same release plan , we have to therefore check to see if warning
           is present for this release plan on any other date, if not we can safely remove flag from release plan
       */


        logger.debug("releaseWarningCount warning count is " + releaseWarningCount)
        if (rp && releaseWarningCount == 1) {

            logger.debug("release plan deletion with warning type [" + warningType + "] with release plan Id [" + rp._id + "]")
            warningResponse.removed.push({
                _id: rp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: warningType,
                source: rp.source
            })
        }
    })
    warning.releases.forEach(r => {
        if (r) {
            warningResponse.removed.push({
                _id: r._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: warningType,
                source: r.source
            })
        }
    })
    await warning.remove()
    return warningResponse
}

/*-------------------------------------------------------------------DELETE_WARNING_WITH_RESPONSE_SECTION_END----------------------------------------------------------*/

/*------------------------------------------------------------------------GET_DISTINCT_RELEASES_START--------------------------------------------------------------*/
const getAffectedReleasesEmployeeDay = async (release, date, employeeID, warningName) => {

    let warningResponse = {
        added: [],
        removed: []
    }
    let affectedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
        'planningDate': date,
        'employee._id': employeeID
    })

    //This may be first task plan of a release plan in which case it would not become part of affectedReleaseIDs, in that case we are adding it to ensure that it becomes part of final warning response

    if (release) {
        if (affectedReleaseIDs && affectedReleaseIDs.length) {
            affectedReleaseIDs.findIndex(releaseID => releaseID.toString() === release._id.toString()) === -1 && affectedReleaseIDs.push(release._id)
        } else {
            affectedReleaseIDs = [release._id]
        }
    }

    logger.debug('Affected release IDs: [' + warningName + '] of employee [' + employeeID + '] of date [' + U.formatDateInUTC(date) + ']', {affectedReleaseIDs})
    let releasesPromises = affectedReleaseIDs.map(releaseID => {
        return MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID)).then(releaseDetail => {
            if (release && releaseDetail && releaseDetail._id.toString() === release._id.toString()) {
                warningResponse.added.push({
                    _id: releaseDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: warningName,
                    source: true
                })

                return Object.assign({}, releaseDetail.toObject(), {
                    source: true
                })
            } else {
                warningResponse.added.push({
                    _id: releaseDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: warningName,
                    source: false
                })

                return Object.assign({}, releaseDetail.toObject(), {
                    source: false
                })
            }
        })
    })

    let releases = await Promise.all(releasesPromises)
    return {releases, warningResponse}
}

/*------------------------------------------------------------------------GET_DISTINCT_RELEASES_END--------------------------------------------------------------*/

/*------------------------------------------------------------------------GET_DISTINCT_RELEASE_PLANS_START--------------------------------------------------------------*/
const getAffectedReleasePlansEmployeeDay = async (releasePlan, date, employeeID, warningName) => {
    let warningResponse = {
        added: [],
        removed: []
    }
    let distinctReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
        'planningDate': date,
        'employee._id': employeeID
    })
    //This may be first task plan of a release plan in which case it would not become part of distinctReleasePlanIDs, in that case we are adding it to ensure that it becomes part of final warning response

    if (releasePlan) {
        if (distinctReleasePlanIDs && distinctReleasePlanIDs.length) {
            distinctReleasePlanIDs.findIndex(releasePlanID => releasePlanID.toString() === releasePlan._id.toString()) === -1 && distinctReleasePlanIDs.push(releasePlan._id)
        } else {
            distinctReleasePlanIDs = [releasePlan._id]
        }
    }

    logger.debug('getDistinctReleasePlansWithResponse:=>  releasePlan IDs of warning [' + warningName + '] of employee [' + employeeID + '] of date [' + date + ']', {distinctReleasePlanIDs})
    let releasePlansPromises = distinctReleasePlanIDs.map(releasePlanID => {
        return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID)).then(releasePlanDetail => {
            if (releasePlan && releasePlanDetail && releasePlanDetail._id.toString() === releasePlan._id.toString()) {
                warningResponse.added.push({
                    _id: releasePlanDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: warningName,
                    source: true
                })

                return Object.assign({}, releasePlanDetail.toObject(), {
                    source: true
                })
            } else {
                warningResponse.added.push({
                    _id: releasePlanDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: warningName,
                    source: false
                })

                return Object.assign({}, releasePlanDetail.toObject(), {
                    source: false
                })
            }
        })
    })

    let releasePlans = await Promise.all(releasePlansPromises)
    return {releasePlans, warningResponse}
}

/*------------------------------------------------------------------------GET_DISTINCT_RELEASE_PLANS_END--------------------------------------------------------------*/


/*
* |____________________________________________________________________TASK_PLAN_START____________________________________________________________________|
*/


/*-------------------------------------------------------------------TASK_PLAN_ADDED_SECTION_START-------------------------------------------------------------------*/

// Add too many hours warning
const addTooManyHours = async (taskPlan, releasePlan, release, employee, momentPlanningDate) => {
    /**
     * It is possible that this warning is raised earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */

    let warningResponse = {
        added: [],
        removed: []
    }

    let planningDateUtc = U.dateInUTC(momentPlanningDate)

    /* See if there is already a too many hours warning */
    let tooManyHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': momentPlanningDate.toDate(),
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (tooManyHoursWarning) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS of same employee and planned date */
        /* Check current release is available in release list of warning if not available then push it to list*/
        if (tooManyHoursWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
            tooManyHoursWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })
        }

        /* Check current releasePlan is available in releasePlan list of warning if not available then push it to list*/
        if (tooManyHoursWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) === -1) {
            tooManyHoursWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))

            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })
        }

        tooManyHoursWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))

        await tooManyHoursWarning.save()

        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_TOO_MANY_HOURS,
            source: true
        })

    } else {
        /* create a new warning :- WARNING_TOO_MANY_HOURS -: warning for selected developer and selected date as a planned date*/
        let newTooManyHoursWarning = new WarningModel()
        let employeeDays = await MDL.EmployeeDaysModel.find({
            'date': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        // find out release ids added in current task plans of same day/same employee as those would be affected by this warning
        let releaseObject = await getAffectedReleasesEmployeeDay(release, planningDateUtc, employee._id, SC.WARNING_TOO_MANY_HOURS)
        let releases = releaseObject.releases
        if (releaseObject.warningResponse.added && releaseObject.warningResponse.added.length)
            warningResponse.added.push(...releaseObject.warningResponse.added)
        if (releaseObject.warningResponse.removed && releaseObject.warningResponse.removed.length)
            warningResponse.removed.push(...releaseObject.warningResponse.removed)

        // find out releasePlan ids added in current task plans of same day/same employee as those would be affected by this warning
        let releasePlanObject = await getAffectedReleasePlansEmployeeDay(releasePlan, planningDateUtc, employee._id, SC.WARNING_TOO_MANY_HOURS)
        let releasePlans = releasePlanObject.releasePlans
        if (releasePlanObject.warningResponse.added && releasePlanObject.warningResponse.added.length)
            warningResponse.added.push(...releasePlanObject.warningResponse.added)
        if (releasePlanObject.warningResponse.removed && releasePlanObject.warningResponse.removed.length)
            warningResponse.removed.push(...releasePlanObject.warningResponse.removed)
        // fetch task plans as all task plans are affected by this warning and hence need to be added against this warning

        let taskPlans = await MDL.TaskPlanningModel.find({
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })


        if (taskPlans && taskPlans.length) {
            taskPlans.findIndex(tp => tp._id.toString() === taskPlan._id.toString()) === -1 && taskPlans.push(taskPlan.toObject())
        } else {
            taskPlans = [taskPlan.toObject()]
        }

        taskPlans.forEach(t => {
            if (t._id.toString() === taskPlan._id.toString()) {
                warningResponse.added.push({
                    _id: taskPlan._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: true
                })
            } else {
                warningResponse.added.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: false
                })
            }
        })

        newTooManyHoursWarning.type = SC.WARNING_TOO_MANY_HOURS
        newTooManyHoursWarning.taskPlans = taskPlans && taskPlans.length ? taskPlans.map(tp => tp._id.toString() === taskPlan._id.toString() ? Object.assign({}, taskPlan.toObject(), {source: true}) : tp) : []
        newTooManyHoursWarning.releasePlans = [...releasePlans]
        newTooManyHoursWarning.releases = [...releases]
        newTooManyHoursWarning.employeeDays = [...employeeDays]
        await newTooManyHoursWarning.save()
    }
    return warningResponse
}

const addEmployeeAskForLeave = async (taskPlan, releasePlan, release, employee, momentPlanningDate) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeAskForLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDays.date': momentPlanningDate.toDate(),
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeAskForLeaveWarning) {

        //update warning WARNING_EMPLOYEE_ASK_FOR_LEAVE
        employeeAskForLeaveWarning.taskPlans = [...employeeAskForLeaveWarning.taskPlans, Object.assign({}, taskPlan.toObject(), {source: true})]
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            source: true
        })


        if (employeeAskForLeaveWarning.releasePlans && employeeAskForLeaveWarning.releasePlans.length && employeeAskForLeaveWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) === -1) {
            employeeAskForLeaveWarning.releasePlans = [...employeeAskForLeaveWarning.releasePlans, Object.assign({}, releasePlan.toObject(), {source: true})]
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        }
        if (employeeAskForLeaveWarning.releases && employeeAskForLeaveWarning.releases.length && employeeAskForLeaveWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
            employeeAskForLeaveWarning.releases = [...employeeAskForLeaveWarning.releases, Object.assign({}, release.toObject(), {source: true})]
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        }
        await employeeAskForLeaveWarning.save()
    } else {
        let leaves = await MDL.LeaveModel.find({
            'user._id': mongoose.Types.ObjectId(employee._id),
            'startDate': {$gte: momentPlanningDate.toDate()},
            'endDate': {$lte: momentPlanningDate.toDate()},
            'status': SC.LEAVE_STATUS_RAISED
        })
        if (leaves && leaves.length) {
            let newEmployeeAskForLeaveWarning = new WarningModel()
            newEmployeeAskForLeaveWarning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            newEmployeeAskForLeaveWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            newEmployeeAskForLeaveWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            newEmployeeAskForLeaveWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
            newEmployeeAskForLeaveWarning.employeeDays = [Object.assign({}, employee.toObject(), {
                source: true,
                name: employee.firstName + ' ' + employee.lastName,
                dateString: U.formatDateInUTC(momentPlanningDate.toDate()),
                date: momentPlanningDate.toDate()
            })]

            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            await newEmployeeAskForLeaveWarning.save()
        }

    }
    return warningResponse
}

const updateEmployeeOnLeaveOnAddTaskPlan = async (taskPlan, releasePlan, release, employee, momentPlanningDate) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeOnLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ON_LEAVE,
        'employeeDays.date': momentPlanningDate.toDate(),
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeOnLeaveWarning) {

        //update warning WARNING_EMPLOYEE_ON_LEAVE
        employeeOnLeaveWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ON_LEAVE,
            source: true
        })

        if (employeeOnLeaveWarning.releasePlans && employeeOnLeaveWarning.releasePlans.length && employeeOnLeaveWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) > -1) {
            employeeOnLeaveWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        }
        if (employeeOnLeaveWarning.releases && employeeOnLeaveWarning.releases.length && employeeOnLeaveWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) > -1) {
            employeeOnLeaveWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        }

        await employeeOnLeaveWarning.save()


    } else {
        let leaves = await MDL.LeaveModel.find({
            'user._id': mongoose.Types.ObjectId(employee._id),
            'startDate': {$gte: momentPlanningDate.toDate()},
            'endDate': {$lte: momentPlanningDate.toDate()},
            'status': SC.LEAVE_STATUS_APPROVED
        })

        if (leaves && leaves.length) {

            let newEmployeeOnLeaveWarning = new WarningModel()
            newEmployeeOnLeaveWarning.type = SC.WARNING_EMPLOYEE_ON_LEAVE
            newEmployeeOnLeaveWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            newEmployeeOnLeaveWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            newEmployeeOnLeaveWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
            newEmployeeOnLeaveWarning.employeeDays = [Object.assign({}, employee.toObject(), {
                source: true,
                name: employee.firstName + ' ' + employee.lastName,
                dateString: U.formatDateInUTC(momentPlanningDate.toDate()),
                date: momentPlanningDate.toDate()
            })]
            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            await newEmployeeOnLeaveWarning.save()
        }

    }
    return warningResponse
}

/**
 * Handles code related to add less planned hours warning
 */
const addLessPlannedHoursOnAddTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let lessPlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_LESS_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    if (lessPlannedHoursWarning) {
        // For release check
        if (lessPlannedHoursWarning.releases && lessPlannedHoursWarning.releases.length && lessPlannedHoursWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
            lessPlannedHoursWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_LESS_PLANNED_HOURS,
                source: true
            })
        }
        // For releasePlan check
        if (lessPlannedHoursWarning.releasePlans.findIndex(rp => rp && rp._id && releasePlan.toObject()._id && rp._id.toString() === releasePlan.toObject()._id.toString()) === -1) {
            lessPlannedHoursWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_LESS_PLANNED_HOURS,
                source: true
            })
        }
        /*
        *  //No need to check for task plan it will always be a new task plan
         lessPlannedHoursWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
         warningResponse.added.push({
             _id: taskPlan._id,
             warningType: SC.WARNING_TYPE_TASK_PLAN,
             type: SC.WARNING_LESS_PLANNED_HOURS,
             source: true
         })*/
        await lessPlannedHoursWarning.save()
    } else {
        /*need to delete existing more planned hours warning*/
        warningResponse = await deleteMorePlannedHours(releasePlan)

        let newLessPlannedHoursWarning = new WarningModel()
        newLessPlannedHoursWarning.type = SC.WARNING_LESS_PLANNED_HOURS


        let taskPlans = await MDL.TaskPlanningModel.find({
            'releasePlan._id': mongoose.Types.ObjectId(releasePlan._id),
        })

        /*  if (taskPlans && taskPlans.length) {
              taskPlans.findIndex(tp => tp._id.toString() === taskPlan._id.toString()) === -1 && taskPlans.push(taskPlan.toObject())
          } else {
              taskPlans = [taskPlan.toObject()]
          }
          taskPlans.forEach(t => {
              if (t._id.toString() === taskPlan._id.toString())
                  warningResponse.added.push({
                      _id: t._id,
                      warningType: SC.WARNING_TYPE_TASK_PLAN,
                      type: SC.WARNING_LESS_PLANNED_HOURS,
                      source: true
                  })
              else warningResponse.added.push({
                  _id: t._id,
                  warningType: SC.WARNING_TYPE_TASK_PLAN,
                  type: SC.WARNING_LESS_PLANNED_HOURS,
                  source: false
              })
          })

          newLessPlannedHoursWarning.taskPlans = taskPlans && taskPlans.length ? taskPlans.map(tp => tp._id.toString() === taskPlan._id.toString() ? Object.assign({}, taskPlan.toObject(), {source: true}) : tp) : []
          */
        newLessPlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newLessPlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]


        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_LESS_PLANNED_HOURS,
            source: true
        })
        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_LESS_PLANNED_HOURS,
            source: true
        })
        await newLessPlannedHoursWarning.save()
    }
    return warningResponse
}

const addMorePlannedHoursOnAddTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let morePlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_MORE_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    if (morePlannedHoursWarning) {

        /*
        // For release check
        if (morePlannedHoursWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
            morePlannedHoursWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            logger.debug('WARNING_MORE_PLANNED_HOURS release', {release})
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_MORE_PLANNED_HOURS,
                source: true
            })
        }
        // For releasePlan check
        if (morePlannedHoursWarning.releasePlans.findIndex(rp => rp && rp._id && releasePlan.toObject()._id && rp._id.toString() === releasePlan.toObject()._id.toString()) === -1) {
            morePlannedHoursWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_MORE_PLANNED_HOURS,
                source: true
            })
        }



        //No need to check for task plan it will always be a new task plan
        morePlannedHoursWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })
        */
        await morePlannedHoursWarning.save()
        return warningResponse
    }
    else {

        let deleteWarningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)

        if (deleteWarningsLessPlannedHours.added && deleteWarningsLessPlannedHours.added.length)
            warningResponse.added.push(...deleteWarningsLessPlannedHours.added)
        if (deleteWarningsLessPlannedHours.removed && deleteWarningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...deleteWarningsLessPlannedHours.removed)


        let newMorePlannedHoursWarning = new WarningModel()
        newMorePlannedHoursWarning.type = SC.WARNING_MORE_PLANNED_HOURS

        let taskPlans = await MDL.TaskPlanningModel.find({
            'releasePlan._id': mongoose.Types.ObjectId(releasePlan._id),
        })

        /*
                if (taskPlans && taskPlans.length) {
                    taskPlans.findIndex(tp => tp._id.toString() === taskPlan._id.toString()) === -1 && taskPlans.push(taskPlan.toObject())
                } else {
                    taskPlans = [taskPlan.toObject()]
                }
                taskPlans.forEach(t => {
                    if (t._id.toString() === taskPlan._id.toString())
                        warningResponse.added.push({
                            _id: t._id,
                            warningType: SC.WARNING_TYPE_TASK_PLAN,
                            type: SC.WARNING_MORE_PLANNED_HOURS,
                            source: true
                        })
                    else warningResponse.added.push({
                        _id: t._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_MORE_PLANNED_HOURS,
                        source: false
                    })
                })
                newMorePlannedHoursWarning.taskPlans = taskPlans && taskPlans.length ? taskPlans.map(tp => tp._id.toString() === taskPlan._id.toString() ? Object.assign({}, taskPlan.toObject(), {source: true}) : tp) : []
               */
        newMorePlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newMorePlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })
        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })

        await newMorePlannedHoursWarning.save()
    }
    return warningResponse
}

const deleteMorePlannedHours = async (releasePlan) => {
    let warningResponse = {
        added: [],
        removed: []
    }
    let morePlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_MORE_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
    if (morePlannedHoursWarning) {
        /*more planned hour warning available need to delete it*/
        let deleteWarningResponse = await deleteWarningWithResponse(morePlannedHoursWarning, SC.WARNING_MORE_PLANNED_HOURS)
        if (deleteWarningResponse.added && deleteWarningResponse.added.length)
            warningResponse.added.push(...deleteWarningResponse.added)
        if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
            warningResponse.removed.push(...deleteWarningResponse.removed)
    }

    return warningResponse
}


const deleteLessPlannedHours = async (releasePlan) => {


    let warningResponse = {
        added: [],
        removed: []
    }
    let lessPlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_LESS_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
    if (lessPlannedHoursWarning) {
        /*less planned hour warning available need to delete it*/
        let deleteWarningResponse = await deleteWarningWithResponse(lessPlannedHoursWarning, SC.WARNING_LESS_PLANNED_HOURS)
        if (deleteWarningResponse.added && deleteWarningResponse.added.length)
            warningResponse.added.push(...deleteWarningResponse.added)
        if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
            warningResponse.removed.push(...deleteWarningResponse.removed)
    }

    return warningResponse
}

/**
 * Called when any task is planned
 */
warningSchema.statics.taskPlanAdded = async (taskPlan, releasePlan, release, employee, plannedHourNumber, momentPlanningDate, firstTaskOfReleasePlan, addedAfterMaxDate) => {
    // See if this addition of planning causes too many hours warning
    // Check if planned hours crossed limit of maximum hours as per configuration, if yes generate too many hours warning
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let employeeDay = await MDL.EmployeeDaysModel.findOne({
        'date': momentPlanningDate,
        'employee._id': mongoose.Types.ObjectId(employee._id)
    })

    let warningResponse = {
        added: [],
        removed: []
    }


    //TOO MANY HOURS UPDATE

    if (plannedHourNumber > maxPlannedHoursNumber || employeeDay.plannedHours > maxPlannedHoursNumber) {
        let warningsTooManyHours = await addTooManyHours(taskPlan, releasePlan, release, employee, momentPlanningDate)
        if (warningsTooManyHours.added && warningsTooManyHours.added.length)
            warningResponse.added.push(...warningsTooManyHours.added)
        if (warningsTooManyHours.removed && warningsTooManyHours.removed.length)
            warningResponse.removed.push(...warningsTooManyHours.removed)
    }

    //UNPLANNED UPDATE

    // If this is first task planned against a release plan, unplanned warning would be removed from release plan
    if (firstTaskOfReleasePlan) {
        // since this is first task of release plan, unplanned warning would be removed from release plan
        await WarningModel.remove({
            type: SC.WARNING_UNPLANNED,
            'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
        })
        warningResponse.removed.push({
            _id: taskPlan.releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_UNPLANNED
        })

    }

    //PENDING ON END DATE UPDATE
    if (addedAfterMaxDate) {

        /**
         * Since this planning is added after max planning date, if there are pending on end date warning remove those
         */

        let pendingOnEndDateWarning = await WarningModel.findOne({
            type: SC.WARNING_PENDING_ON_END_DATE,
            'releasePlans': {
                '$elemMatch': {
                    _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                    'employee._id': mongoose.Types.ObjectId(employee._id)
                }
            }
        })

        if (pendingOnEndDateWarning) {
            // remove warning
            pendingOnEndDateWarning.remove()
            warningResponse.removed.push({
                _id: taskPlan.releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_PENDING_ON_END_DATE
            })

            // iterate on each task plan that was added against this warning and return removal of those task plans
            pendingOnEndDateWarning.taskPlans.forEach(t => {
                warningResponse.removed.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_PENDING_ON_END_DATE
                })
            })
        }

        /**
         * Since this planning is added after max planning date, if there are warnings like completed before end date against this employee remove those
         */
            //COMPLETED BEFORE END DATE UPDATE

        let completedBeforeEndDateWarning = await WarningModel.findOne({
                type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
                'releasePlans': {
                    '$elemMatch': {
                        _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                        'employee._id': mongoose.Types.ObjectId(employee._id)
                    }
                }
            })

        if (completedBeforeEndDateWarning) {
            // remove warning
            completedBeforeEndDateWarning.remove()
            warningResponse.removed.push({
                _id: taskPlan.releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_COMPLETED_BEFORE_END_DATE
            })
        }
    }

    //EMPLOYEE ASK FOR LEAVE UPDATE
    let warningsAskForLeave = await addEmployeeAskForLeave(taskPlan, releasePlan, release, employee, momentPlanningDate)
    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)
    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)

    //EMPLOYEE ON LEAVE UPDATE
    let warningsOnLeave = await updateEmployeeOnLeaveOnAddTaskPlan(taskPlan, releasePlan, release, employee, momentPlanningDate)

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)
    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)

    //LESS PLANNED HOURS OR MORE PLANNED HOURS OR NO WARNING AT ALL
    if (releasePlan.planning.plannedHours < releasePlan.task.estimatedHours) {
        /*Add less planned hours warning*/
        logger.debug('WarningModel.taskPlanAdded(): planned hours are less than actual estimated hours so need to raise warning')

        let warningsLessPlannedHours = await addLessPlannedHoursOnAddTaskPlan(taskPlan, releasePlan, release)

        if (warningsLessPlannedHours.added && warningsLessPlannedHours.added.length)
            warningResponse.added.push(...warningsLessPlannedHours.added)
        if (warningsLessPlannedHours.removed && warningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...warningsLessPlannedHours.removed)

    } else if (releasePlan.planning.plannedHours > releasePlan.task.estimatedHours) {
        /*Add more planned hours warning*/
        logger.debug('WarningModel.taskPlanAdded(): planned hours are more than actual estimated hours so need to raise warning')

        let warningsMorePlannedHours = await addMorePlannedHoursOnAddTaskPlan(taskPlan, releasePlan, release)
        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)
    } else {
        /*delete more planned hours warning and less planned hours warning*/
        logger.debug('WarningModel.taskPlanAdded(): planned hours are equal to estimated hours so no need to raise warning delete all less planned hours and more planned hours warning')
        let deleteWarningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)
        if (deleteWarningsMorePlannedHours.added && deleteWarningsMorePlannedHours.added.length)
            warningResponse.added.push(...deleteWarningsMorePlannedHours.added)
        if (deleteWarningsMorePlannedHours.removed && deleteWarningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...deleteWarningsMorePlannedHours.removed)


        let deleteWarningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)
        if (deleteWarningsLessPlannedHours.added && deleteWarningsLessPlannedHours.added.length)
            warningResponse.added.push(...deleteWarningsLessPlannedHours.added)
        if (deleteWarningsLessPlannedHours.removed && deleteWarningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...deleteWarningsLessPlannedHours.removed)
    }
    return warningResponse
}

/*-------------------------------------------------------------------TASK_PLAN_ADDED_SECTION_END-------------------------------------------------------------------*/


/*-------------------------------------------------------------------TASK_PLAN_DELETED_SECTION_START-------------------------------------------------------------------*/

/**
 * Called when task plan is removed. Make necessary warning changes
 *
 */
const deleteTooManyHours = async (taskPlan, releasePlan, release, plannedDateUTC) => {

    logger.debug("WarningModel->deleteTooManyHours() called")

    /**
     * It is possible that this warning is  earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */
    let warningResponse = {
        added: [],
        removed: []
    }
    let employeeDay = await MDL.EmployeeDaysModel.findOne({
        'employee._id': mongoose.Types.ObjectId(taskPlan.employee._id),
        'date': plannedDateUTC
    })

    logger.debug("WarningModel->deleteTooManyHours(): ", {employeeDay})

    //fetch employee setting
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    logger.debug("WarningModel->deleteTooManyHours(): ", {maxPlannedHoursNumber})

    let employeeID = employeeDay.employee._id

    let tooManyHourWarning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': plannedDateUTC,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employeeID)
    })

    if (tooManyHourWarning) {
        logger.debug("WarningModel->deleteTooManyHours(): too many hours warning found for date ", {plannedDateUTC})

        /* Update Existing warning WARNING_TOO_MANY_HOURS*/
        if (employeeDay.plannedHours <= maxPlannedHoursNumber) {

            logger.debug("WarningModel->deleteTooManyHours(): Remaining hours are less than max planned hours, warning for this date would be removed for this date")

            // As planned hours reduced to max hours or below, we will delete too many hours warning for that particular date
            // Since warning would be removed for that particular date flag should be removed from all the task plans of that date/employee combination

            let taskPlans = await MDL.TaskPlanningModel.find({
                'planningDate': plannedDateUTC,
                'employee._id': mongoose.Types.ObjectId(employeeDay.employee._id)
            })

            taskPlans.forEach(t => {
                warningResponse.removed.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS
                })
            })

             /*
                Although TMH warning is removed from a particular date of release plan but it is possible
                that warning still exists on other dates, we have to therefore check to see if TMH warning
                is present for this release plan on any other date, if not we can safely remove flag from release plan
            */


            let tmhWarningCount = await WarningModel.count({
                type: SC.WARNING_TOO_MANY_HOURS,
                'releasePlans._id': releasePlan._id
            })

            logger.debug("tmh warning count is " + tmhWarningCount)

            if (tmhWarningCount == 1) {
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS
                })
            }
            await tooManyHourWarning.remove()
        } else {
            tooManyHourWarning.taskPlans = tooManyHourWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())
            warningResponse.removed.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })

            if (tooManyHourWarning.taskPlans && tooManyHourWarning.taskPlans.length) {
                // Since a task plan is removed it is possible that this task plan is last task plan for a release
                let otherTaskPlanReleaseExists = tooManyHourWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) !== -1
                if (!otherTaskPlanReleaseExists) {
                    tooManyHourWarning.releases = tooManyHourWarning.releases.filter(r => r._id.toString() !== release._id.toString())
                    warningResponse.removed.push({
                        _id: release._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        type: SC.WARNING_TOO_MANY_HOURS
                    })
                }

                let otherTaskPlanReleasePlanExists = tooManyHourWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) !== -1
                if (!otherTaskPlanReleasePlanExists) {
                    tooManyHourWarning.releasePlans = tooManyHourWarning.releasePlans.filter(r => r._id.toString() !== releasePlan._id.toString())
                    warningResponse.removed.push({
                        _id: releasePlan._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: true
                    })
                }

                await tooManyHourWarning.save()
            } else {
                //warning response calculation
                let deleteWarningResponse = await deleteWarningWithResponse(tooManyHourWarning, SC.WARNING_TOO_MANY_HOURS)
                if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                    warningResponse.added.push(...deleteWarningResponse.added)
                if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                    warningResponse.removed.push(...deleteWarningResponse.removed)
            }
        }
    } else {
        // As per current code that is called without any precondition, it is possible that no warning exists with too many hours so commenting code to throw error

        //throw new AppError('Warning is not available to delete ', EC.DATA_INCONSISTENT, EC.HTTP_BAD_REQUEST)
    }
    return warningResponse
}

const updateEmployeeAskForLeaveOnDeleteTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeAskForLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDays.date': taskPlan.planningDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(taskPlan.employee._id)
    })

    if (employeeAskForLeaveWarning) {
        //update warning WARNING_EMPLOYEE_ASK_FOR_LEAVE
        employeeAskForLeaveWarning.taskPlans = employeeAskForLeaveWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            source: true
        })
        if (employeeAskForLeaveWarning.taskPlans && employeeAskForLeaveWarning.taskPlans.length > 0) {

            if (employeeAskForLeaveWarning.taskPlans && employeeAskForLeaveWarning.taskPlans.length && employeeAskForLeaveWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) > -1) {
                employeeAskForLeaveWarning.releasePlans = employeeAskForLeaveWarning.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            }
            if (employeeAskForLeaveWarning.taskPlans && employeeAskForLeaveWarning.taskPlans.length && employeeAskForLeaveWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) > -1) {
                employeeAskForLeaveWarning.releases = employeeAskForLeaveWarning.releases.filter(r => r._id.toString() !== release._id.toString())
                warningResponse.removed.push({
                    _id: release._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            }
            await employeeAskForLeaveWarning.save()

        } else {

            let deleteWarningResponse = await deleteWarningWithResponse(employeeAskForLeaveWarning, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)

        }
    }
    return warningResponse
}


const updateEmployeeOnLeaveOnDeleteTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeOnLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ON_LEAVE,
        'employeeDays.date': taskPlan.planningDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(taskPlan.employee._id)
    })

    if (employeeOnLeaveWarning) {
        //update warning WARNING_EMPLOYEE_ON_LEAVE
        employeeOnLeaveWarning.taskPlans = employeeOnLeaveWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ON_LEAVE,
            source: true
        })
        if (employeeOnLeaveWarning.taskPlans && employeeOnLeaveWarning.taskPlans.length > 0) {

            if (employeeOnLeaveWarning.taskPlans && employeeOnLeaveWarning.taskPlans.length && employeeOnLeaveWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) > -1) {
                employeeOnLeaveWarning.releasePlans = employeeOnLeaveWarning.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }
            if (employeeOnLeaveWarning.taskPlans && employeeOnLeaveWarning.taskPlans.length && employeeOnLeaveWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) > -1) {
                employeeOnLeaveWarning.releases = employeeOnLeaveWarning.releases.filter(r => r._id.toString() !== release._id.toString())
                warningResponse.removed.push({
                    _id: release._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }
            await employeeOnLeaveWarning.save()

        } else {
            let deleteWarningResponse = await deleteWarningWithResponse(employeeOnLeaveWarning, SC.WARNING_EMPLOYEE_ON_LEAVE)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)

        }
    }
    return warningResponse
}


/**
 * Handles code related to add less planned hours warning
 */
const addLessPlannedHoursOnDeleteTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let lessPlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_LESS_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    if (!lessPlannedHoursWarning) {

        // It is possible that planned hours were more than estimated hours prior to this deletion
        // In that case there would be a more planned hours warning (otherwise there would not be, but we need to check)

        let warningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)
        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)

        let newLessPlannedHoursWarning = new WarningModel()
        newLessPlannedHoursWarning.type = SC.WARNING_LESS_PLANNED_HOURS


        /*
        let taskPlans = await MDL.TaskPlanningModel.find({
            'releasePlan._id': mongoose.Types.ObjectId(releasePlan._id),
        })


        if (taskPlans && taskPlans.length) {

            taskPlans.findIndex(tp => tp._id.toString() === taskPlan._id.toString()) === -1 && taskPlan.push(taskPlan.toObject())
        } else {
            taskPlans = [taskPlan.toObject()]
        }


        taskPlans.forEach(t => {
            if (t._id.toString() === taskPlan._id.toString())
                warningResponse.added.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_LESS_PLANNED_HOURS,
                    source: true
                })
            else warningResponse.added.push({
                _id: t._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_LESS_PLANNED_HOURS,
                source: false
            })
        })

        */

        newLessPlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newLessPlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]

        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_LESS_PLANNED_HOURS,
            source: true
        })
        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_LESS_PLANNED_HOURS,
            source: true
        })
        await newLessPlannedHoursWarning.save()
    }
    return warningResponse
}


/**
 * Handles code related to add more planned hours warning
 */
const addMorePlannedHoursOnDeleteTaskPlan = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let morePlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_MORE_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    if (!morePlannedHoursWarning) {
        /*need to delete existing more planned hours warning*/
        //warningResponse = await deleteLessPlannedHours(releasePlan)

        let newMorePlannedHoursWarning = new WarningModel()
        newMorePlannedHoursWarning.type = SC.WARNING_MORE_PLANNED_HOURS

        /*
                let taskPlans = await MDL.TaskPlanningModel.find({
                    'releasePlan._id': mongoose.Types.ObjectId(releasePlan._id),
                })


                if (taskPlans && taskPlans.length) {

                    taskPlans.findIndex(tp => tp._id.toString() === taskPlan._id.toString()) === -1 && taskPlan.push(taskPlan.toObject())
                } else {
                    taskPlans = [taskPlan.toObject()]
                }


                taskPlans.forEach(t => {
                    if (t._id.toString() === taskPlan._id.toString())
                        warningResponse.added.push({
                            _id: t._id,
                            warningType: SC.WARNING_TYPE_TASK_PLAN,
                            type: SC.WARNING_MORE_PLANNED_HOURS,
                            source: true
                        })
                    else warningResponse.added.push({
                        _id: t._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_MORE_PLANNED_HOURS,
                        source: false
                    })
                })

        */

        newMorePlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newMorePlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]

        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })
        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })
        await newMorePlannedHoursWarning.save()
    }
    return warningResponse
}

warningSchema.statics.taskPlanDeleted = async (taskPlan, releasePlan, release) => {
    /* As task plan is removed it is possible that there is no planning left for this release plan so check that and see if unplanned warning/flag needs to
     be added again
   */
    let warningResponse = {
        added: [],
        removed: []
    }


    let plannedDateUTC = U.dateInUTC(taskPlan.planningDateString)

// UNPLANNED UPDATE
    if (releasePlan.planning.plannedTaskCounts === 0) {
        // this means that this was the last task plan against release plan, so we would have to add unplanned warning again
        // unplanned warning would be raised against a single release and a single release plan
        let warning = {}
        warning.type = SC.WARNING_UNPLANNED
        warning.releases = [Object.assign({}, release.toObject(), {
            source: true
        })],
            warning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
                source: true
            })],
            warning.taskPlans = []
        await WarningModel.create(warning)
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_UNPLANNED,
            source: true
        })
        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_UNPLANNED,
            source: true
        })
    }
//TOO MANY HOURS UPDATE
    let warningsTooManyHours = await deleteTooManyHours(taskPlan, releasePlan, release, plannedDateUTC)

    if (warningsTooManyHours.added && warningsTooManyHours.added.length)
        warningResponse.added.push(...warningsTooManyHours.added)
    if (warningsTooManyHours.removed && warningsTooManyHours.removed.length)
        warningResponse.removed.push(...warningsTooManyHours.removed)

    logger.debug('[task-plan-deleted-warning]: [warningsTooManyHours] =>', {warningsTooManyHours})

//EMPLOYEE ASK FOR LEAVE UPDATE
    let warningsAskForLeave = await updateEmployeeAskForLeaveOnDeleteTaskPlan(taskPlan, releasePlan, release)

    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)
    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)
    logger.debug('[task-plan-deleted-warning]: [Employee-Ask-For-Leave] warning response ', {warningsAskForLeave})

//EMPLOYEE ON LEAVE UPDATE

    let warningsOnLeave = await updateEmployeeOnLeaveOnDeleteTaskPlan(taskPlan, releasePlan, release)

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)
    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)
    logger.debug('[task-plan-deleted-warning]: [Employee-On-Leave] warning response ', {warningsOnLeave})


//LESS PLANNED HOURS OR MORE PLANNED HOURS OR NO WARNING AT ALL
    if (releasePlan.planning.plannedHours === 0) {
        /*Only unplanned warning will be there if task plans are not available*/
        logger.debug('[task-plan-deleted-warning]: planned hours are zero delete all warning')
        let warningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)

        if (warningsLessPlannedHours.added && warningsLessPlannedHours.added.length)
            warningResponse.added.push(...warningsLessPlannedHours.added)
        if (warningsLessPlannedHours.removed && warningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...warningsLessPlannedHours.removed)


        let warningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)

        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)


    } else if (releasePlan.planning.plannedHours < releasePlan.task.estimatedHours) {
        // Since task plan is deleted and planned hours are reduced below estimated hours
        // or they might already be less than estimated hours, in both case we would have to check
        // if a less planned hours warning needs to be raised or updated

        logger.debug('[task-plan-deleted-warning]: planned hours are less than actual estimated hours so need to raise warning')

        let warningsLessPlannedHours = await addLessPlannedHoursOnDeleteTaskPlan(taskPlan, releasePlan, release)

        if (warningsLessPlannedHours.added && warningsLessPlannedHours.added.length)
            warningResponse.added.push(...warningsLessPlannedHours.added)
        if (warningsLessPlannedHours.removed && warningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...warningsLessPlannedHours.removed)

    } else if (releasePlan.planning.plannedHours > releasePlan.task.estimatedHours) {
        /*Add more planned hours warning*/
        logger.debug('[task-plan-deleted-warning]: planned hours are more than actual estimated hours so need to raise warning more planned hours')

        let warningsMorePlannedHours = await addMorePlannedHoursOnDeleteTaskPlan(taskPlan, releasePlan, release)

        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)

    } else {
        logger.debug('[task-plan-deleted-warning]: Exceptional condition need to delete all warnings')

        let warningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)

        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)


        let warningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)

        if (warningsLessPlannedHours.added && warningsLessPlannedHours.added.length)
            warningResponse.added.push(...warningsLessPlannedHours.added)
        if (warningsLessPlannedHours.removed && warningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...warningsLessPlannedHours.removed)

    }

    return warningResponse

}
/*-------------------------------------------------------------------TASK_PLAN_DELETED_SECTION_END-------------------------------------------------------------------*/

/*-------------------------------------------------------------------TASK_REPORTED_AS_PENDING_SECTION-------------------------------------------------------------------*/

/**
 * Task reported as pending on end date, see what warning changes can be made
 * @param taskPlan
 * @returns {Promise.<*>}
 */

warningSchema.statics.taskReportedAsPending = async (taskPlan, onEndDate) => {
    //logger.debug('taskReportedAsPendingOnEndDate(): taskplan ', {taskPlan})

    let warningResponse = {
        added: [],
        removed: []
    }

    if (onEndDate) {
        // Task is reported as pending on end date so need to add pending-on-enddate warning
        /**
         * It is possible that this warning is raised earlier as well like when task is reported as pending again on end date by same developer
         * Check to see if release plan of this task already has this warning raised
         *
         * Please note that for a release plan with tasks planned against multiple employee this warning may be raised multiple times one for each
         * employee that has reported task as pending on end date
         */

            // Check to see if pending on end date warning exists for this employee
        let pendingOnEndDateWarning = await WarningModel.findOne({
                type: SC.WARNING_PENDING_ON_END_DATE,
                'releasePlans': {
                    '$elemMatch': {
                        _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                        'employee._id': mongoose.Types.ObjectId(taskPlan.employee._id)
                    }
                }
            })

        //logger.debug('taskReportedAsPendingOnEndDate(): existing warning ', {pendingOnEndDateWarning})

        if (pendingOnEndDateWarning) {
            // there is already a pending on end date warning
            if (!pendingOnEndDateWarning.taskPlans || pendingOnEndDateWarning.taskPlans.findIndex(t => t._id.toString() === taskPlan._id.toString()) === -1) {

                // add task plan against this warning

                pendingOnEndDateWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
                warningResponse.added.push({
                    _id: taskPlan._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    source: true,
                    type: SC.WARNING_PENDING_ON_END_DATE
                })


                // since this task plan was not already part of this warning we would have to see if addition of this task plan would cause new release/releaseplan against this warning

                if (!pendingOnEndDateWarning.releases || pendingOnEndDateWarning.releases.findIndex(r => r._id.toString() === taskPlan.release._id.toString()) === -1) {
                    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlan.release._id), {
                        name: 1,
                        project: 1
                    })
                    pendingOnEndDateWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
                    warningResponse.added.push({
                        _id: release._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        source: true,
                        type: SC.WARNING_PENDING_ON_END_DATE
                    })

                }

                if (!pendingOnEndDateWarning.releasePlans || pendingOnEndDateWarning.releasePlans.findIndex(r => r._id.toString() === taskPlan.releasePlan._id.toString()) === -1) {
                    let releasePlan = await MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlan.releasePlan._id), {task: 1})
                    pendingOnEndDateWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
                    warningResponse.added.push({
                        _id: releasePlan._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        source: true,
                        type: SC.WARNING_PENDING_ON_END_DATE
                    })
                }
            }

            await pendingOnEndDateWarning.save()
            return warningResponse
        } else {

            // Warning pending on end date yet not added against this employee
            pendingOnEndDateWarning = {}
            pendingOnEndDateWarning.type = SC.WARNING_PENDING_ON_END_DATE

            let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlan.release._id), {
                name: 1,
                project: 1
            })
            //logger.debug('taskReportedAsPendingOnEndDate(): ', {release})
            pendingOnEndDateWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
            let releasePlan = await MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlan.releasePlan._id), {task: 1})
            //logger.debug('taskReportedAsPendingOnEndDate(): ', {releasePlan})
            pendingOnEndDateWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
                source: true,
                employee: {
                    _id: taskPlan.employee._id
                }
            })]
            pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
                source: true
            })]
            //logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
            await WarningModel.create(pendingOnEndDateWarning)

            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                source: true,
                type: SC.WARNING_PENDING_ON_END_DATE
            })
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                source: true,
                type: SC.WARNING_PENDING_ON_END_DATE
            })
            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                source: true,
                type: SC.WARNING_PENDING_ON_END_DATE
            })
        }
    }
    return warningResponse
}

/*-------------------------------------------------------------------TASK_REPORTED_AS_COMPLETE_SECTION-------------------------------------------------------------------*/

/**
 * Task reported as completed see what warning changes can be made
 *
 */
warningSchema.statics.taskReportedAsCompleted = async (taskPlan, releasePlan, beforeEndDate) => {
    //logger.debug('taskReportedAsCompleted(): ', {taskPlan}, {releasePlan}, {beforeEndDate})
    /**
     * As task is reported as completed remove pending-on-enddate warning (if any)
     */

    let warningResponse = {
        added: [],
        removed: []
    }

    if (beforeEndDate) {
        /* Task is reported as completed before end date, we need to raise that warning so that manager can plan other tasks on saved days
           It is important to understand that a release plan can be worked on by multiple employees and advance completion would go against a particular
           employee so there can be multiple such warnings each against one employee that have completed there task plan before time
         */

        // since an employee can mark only mark maximum of one task as complete we can safely assume that there will be no existing warning
        // We are trusting existing code here that shouldn't allow completion of multiple task plans and also remove this warning whenever necessary

        let completeBeforeWarning = {}
        completeBeforeWarning.type = SC.WARNING_COMPLETED_BEFORE_END_DATE
        let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlan.release._id), {
            name: 1,
            project: 1
        })
        //logger.debug('taskReportedAsCompleted(): ', {release})
        completeBeforeWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlan.releasePlan._id), {task: 1})
        //logger.debug('taskReportedAsCompleted(): ', {releasePlan})
        completeBeforeWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
            source: true,
            employee: {
                _id: taskPlan.employee._id
            }
        })]
        completeBeforeWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
        //logger.debug('taskReportedAsCompleted():  creating warning ', {warning: completeBeforeWarning})

        warningResponse.added.push({
            _id: release._id,
            warningType: SC.WARNING_TYPE_RELEASE,
            type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
            source: true
        })
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
            source: true
        })
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
            source: true
        })
    } else {
        /*
        This means that task is reported as completed on end date, in case employee has earlier reported this task as pending that would have resulted in
        pending on end date so remove any such warnings
         */

        let warningsPendingEndDate = await MDL.WarningModel.find({
            type: SC.WARNING_PENDING_ON_END_DATE,
            'releasePlans': {
                '$elemMatch': {
                    _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                    'employee._id': taskPlan.employee._id
                }
            }
        })

        //logger.debug('taskReportedAsCompleted(): found [' + warningsPendingEndDate.length + '] pending on end date warnings')

        // remove all warnings

        let warningPendingEndDatePromises = warningsPendingEndDate.map(w => w.remove())

        let removedWarnings = await Promise.all(warningPendingEndDatePromises)

        //logger.debug('taskReportedAsCompleted(): ', {removedWarnings})

        let promiseArray = []

        removedWarnings.forEach(w => {
            if (w.taskPlans && w.taskPlans.length) {
                w.taskPlans.forEach(t => {
                    warningResponse.removed.push({
                        _id: t._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_PENDING_ON_END_DATE,
                        source: t.source
                    })
                })
            }
        })

        let releasePlanIDs = []
        removedWarnings.forEach(w => {
            if (w.releasePlans && w.releasePlans.length) {
                w.releasePlans.forEach(r => {
                    if (releasePlanIDs.indexOf(r._id) == -1)
                        releasePlanIDs.push(r._id)
                })
            }
        })
        //logger.debug('release plan ids ', {releasePlanIDs})

        if (releasePlanIDs.length) {
            let promises = releasePlanIDs.map(id => {
                return WarningModel.count({
                    type: SC.WARNING_PENDING_ON_END_DATE,
                    'releasePlans._id': mongoose.Types.ObjectId(id)
                }).then(count => {
                    return {
                        _id: id,
                        count: count
                    }
                })
            })
            ////logger.debug('count promises are ', {promises})
            let promisesResult = await Promise.all(promises)
            //logger.debug('count promises results are ', {promiseResult: promisesResult})
            if (promisesResult && promisesResult.length) {
                promisesResult.forEach(p => {
                    //logger.debug('iterating on p ', {p})
                    if (p.count == 0) {
                        // add to removed list only if there is no associated pending on end date warning against this release plan
                        warningResponse.removed.push({
                            _id: p._id,
                            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                            type: SC.WARNING_PENDING_ON_END_DATE
                        })
                    }
                })
            }
        }
    }
    return warningResponse
}

/*-------------------------------------------------------------------MOVE_TO_FUTURE_SECTION_START-------------------------------------------------------------------*/


const addTooManyHoursTasksMoved = async (release, employeeDays, maxPlannedHours) => {

    logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() handling too many hours task moved for date [' + U.formatDateInUTC(employeeDays.date) + ']')

    let warningResponse = {
        added: [],
        removed: []
    }

    /*     Get existing , there is a possibility that this warning is due to tasks that have now shift to other days or probably because
           there are other tasks assigned against this employee on this day in other releases. In asynchronous environment it is very difficult to ascertain
           that warnings of moved tasks would be removed before handling tasks that are moved to this date hence we would rather start afresh

           We will therefore remove this warning later on and create new. We will just see if this warning has any release/plan/task
           added against it that are now not part of new warning if so we would add those to removed list so that flags can be removed from those RPT
         */

    let tooManyHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': employeeDays.date,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employeeDays.employee._id)
    })


    if (employeeDays.plannedHours > maxPlannedHours) {
        let taskPlanData = []
        logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] planned hours crossed max planned hours')
        // find out release ids added in current task plans of same day/same employee as those would be affected by this warning


        let distinctReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
            'planningDate': employeeDays.date,
            'employee._id': mongoose.Types.ObjectId(employeeDays.employee._id)
        })

        let releasesPromises = distinctReleaseIDs.map(releaseID => {
            return MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID)).then(releaseDetail => {
                //logger.debug('releaseDetail', {releaseDetail})
                if (releaseDetail && releaseDetail._id.toString() === release._id.toString()) {
                    warningResponse.added.push({
                        _id: releaseDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: true
                    })

                    return Object.assign({}, releaseDetail.toObject(), {
                        source: true
                    })
                } else {
                    warningResponse.added.push({
                        _id: releaseDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: false
                    })

                    return Object.assign({}, releaseDetail.toObject(), {
                        source: false
                    })
                }
            })
        })

        let releases = await Promise.all(releasesPromises)

        let distinctReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
            'planningDate': employeeDays.date,
            'employee._id': employeeDays.employee._id
        })

        let releasePlanPromises = distinctReleasePlanIDs.map(releasePlanID => {
            return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID)).then(releasePlanDetail => {
                //logger.debug('releasePlanDetail', {releasePlanDetail})

                if (releasePlanDetail && releasePlanDetail.release._id.toString() == release._id.toString()) {
                    warningResponse.added.push({
                        _id: releasePlanDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: true
                    })

                    return Object.assign({}, releasePlanDetail.toObject(), {
                        source: true
                    })
                } else {
                    warningResponse.added.push({
                        _id: releasePlanDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: false
                    })

                    return Object.assign({}, releasePlanDetail.toObject(), {
                        source: false
                    })
                }
            })
        })
        let releasePlans = await Promise.all(releasePlanPromises)

        // fetch task plans as all task plans are affected by this warning and hence need to be added against this warning
        let taskPlans = await MDL.TaskPlanningModel.find({
            'planningDate': employeeDays.date,
            'employee._id': mongoose.Types.ObjectId(employeeDays.employee._id)
        })

        taskPlans.forEach(t => {
            if (t.release._id.toString() == release._id.toString()) {
                warningResponse.added.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: true
                })

                taskPlanData.push(Object.assign({}, t.toObject(), {
                    source: true
                }))

            } else {

                warningResponse.added.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: true
                })

                taskPlanData.push(Object.assign({}, t.toObject(), {
                    source: false
                }))
            }
        })

        // Create warning
        let newWarning = new WarningModel()
        newWarning.type = SC.WARNING_TOO_MANY_HOURS
        newWarning.taskPlans = [...taskPlanData]
        newWarning.releasePlans = [...releasePlans]
        newWarning.releases = [...releases]
        newWarning.employeeDays = [employeeDays]
        logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] creating new warning ', {newWarning})

        try {
            await newWarning.save()
        } catch (error) {
            console.log(error)
        }
    }

    if (tooManyHoursWarning) {
        logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] too many hours warning exists ', {tooManyHoursWarning})
        // Iterate on warning response generated above and compare with date in existing warning to see what needs to keep and what needs to be removed

        tooManyHoursWarning.releases.forEach(r => {
            logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] iterating on release id ' + r._id)
            // Add this release to remove list if it is not added in warning add response
            if (warningResponse.added.findIndex(wa => wa._id.toString() === r._id.toString() && wa.warningType === SC.WARNING_TYPE_RELEASE) === -1) {
                logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] release [' + r._id.toString() + '] not part of new warning hence removing')
                warningResponse.removed.push({
                    _id: r._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: r.source
                })
            }
        })

        tooManyHoursWarning.releasePlans.forEach(rp => {

            if (warningResponse.added.findIndex(wa => wa._id.toString() === rp._id.toString() && wa.warningType === SC.WARNING_TYPE_RELEASE_PLAN) === -1) {
                logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] release plan [' + rp._id.toString() + '] not part of new warning hence removing')
                warningResponse.removed.push({
                    _id: rp._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: rp.source
                })
            }
        })

        tooManyHoursWarning.taskPlans.forEach(tp => {

            if (warningResponse.added.findIndex(wa => wa._id.toString() === tp._id.toString() && wa.warningType === SC.WARNING_TYPE_TASK_PLAN) === -1) {
                logger.debug('[task-shift] WarningModel.addTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDays.date) + '] task plan [' + tp._id.toString() + '] not part of new warning hence removing')
                warningResponse.removed.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: tp.source
                })
            }
        })

        // remove existing warning as we will be creating new
        tooManyHoursWarning.remove()
    }

    return warningResponse
}

warningSchema.statics.movedToFuture = async (release, employeeDays, maxPlannedHoursNumber) => {
    logger.debug('WarningModel.movedToFuture() called: ', {employeeDays}, {maxPlannedHoursNumber})

    let warningResponse = {
        added: [],
        removed: []
    }
    /*-------------------------------------------WARNING UPDATION-------------------------------------------*/
    let tooManyHoursWarning = await addTooManyHoursTasksMoved(release, employeeDays, maxPlannedHoursNumber)


    /*-------------------------------------------RESPONSE UPDATION-------------------------------------------*/
    if (tooManyHoursWarning.added && tooManyHoursWarning.added.length)
        warningResponse.added.push(...tooManyHoursWarning.added)

    if (tooManyHoursWarning.removed && tooManyHoursWarning.removed.length)
        warningResponse.removed.push(...tooManyHoursWarning.removed)

    return warningResponse

}

/*----------------------------------------------------MOVE_TO_FUTURE_SECTION_END-------------------------------------------------------------------*/

/*
* |____________________________________________________________________TASK_PLAN_END____________________________________________________________________|
*/


/*
* |____________________________________________________________________LEAVE_START____________________________________________________________________|
*/

/*--------------------------------------------------------LEAVE_ADDED_SECTION----------------------------------------------------------------------*/

/**
 * Employee raised request for leave
 * @param startDate, endDate, user
 * @returns {Promise.<void>}
 */
warningSchema.statics.leaveAdded = async (startDate, endDate, employee) => {
    console.log("startDate", startDate)
    let startDateMoment = U.momentInUTC(startDate)
    console.log("startDateMoment", startDateMoment)
    let endDateMoment = U.momentInUTC(endDate)
    let singleDateMoment = startDateMoment.clone()
    let finalWarningResponse = {
        added: [],
        removed: []
    }
    /*---------------------Employee Ask For leave ----------------------*/

    while (singleDateMoment.isSameOrBefore(endDateMoment)) {
        let warningResponse = {
            added: [],
            removed: []
        }
        let warning = await WarningModel.findOne({
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            'employeeDays.date': singleDateMoment.toDate(),
            'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
        })
        logger.debug("inside-warning-model-leave-added=> warning", {warning})
        if (!warning) {
            //create warning WARNING_EMPLOYEE_ASK_FOR_LEAVE for this date
            let newWarning = new WarningModel()
            let taskPlans = await MDL.TaskPlanningModel.find({
                'planningDate': singleDateMoment.toDate(),
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })
            if (taskPlans && taskPlans.length && taskPlans.length > 0) {

                taskPlans.forEach(tp => {
                    warningResponse.added.push({
                        _id: tp._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                        source: true
                    })
                })

                // find out release ids added in current task plans of same day/same employee as those would be affected by this warning
                let releaseObject = await getAffectedReleasesEmployeeDay(undefined, singleDateMoment.toDate(), employee._id, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
                let releases = releaseObject.releases
                let releaseWarningResponse = releaseObject.warningResponse
                if (releaseWarningResponse.added && releaseWarningResponse.added.length)
                    warningResponse.added.push(...releaseWarningResponse.added)
                if (releaseWarningResponse.removed && releaseWarningResponse.removed.length)
                    warningResponse.removed.push(...releaseWarningResponse.removed)

                // find out releasePlan ids added in current task plans of same day/same employee as those would be affected by this warning
                let releasePlanObject = await getAffectedReleasePlansEmployeeDay(undefined, singleDateMoment.toDate(), employee._id, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
                let releasePlans = releasePlanObject.releasePlans
                let releasePlanWarningResponse = releasePlanObject.warningResponse
                if (releasePlanWarningResponse.added && releasePlanWarningResponse.added.length)
                    warningResponse.added.push(...releasePlanWarningResponse.added)
                if (releasePlanWarningResponse.removed && releasePlanWarningResponse.removed.length)
                    warningResponse.removed.push(...releasePlanWarningResponse.removed)


                let employeeDay = {
                    employee: employee,
                    dateString: singleDateMoment.format(SC.DATE_FORMAT),
                    date: singleDateMoment.toDate()
                }

                newWarning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                newWarning.taskPlans = [...taskPlans]
                newWarning.releasePlans = [...releasePlans]
                newWarning.releases = [...releases]
                newWarning.employeeDays = [employeeDay]
                await newWarning.save()

            }
        } else {
            //warning already exists for that day no need to do any thing
        }
        if (warningResponse.added && warningResponse.added.length)
            finalWarningResponse.added.push(...warningResponse.added)
        if (warningResponse.removed && warningResponse.removed.length)
            finalWarningResponse.removed.push(...releasePlanWwarningResponsearningResponse.removed)

        singleDateMoment = singleDateMoment.add(1, 'days')
    }
    return finalWarningResponse
}


warningSchema.statics.leaveDeleted = async (startDate, endDate, leave, employee) => {
    let startDateMoment = U.momentInUTC(startDate)
    let endDateMoment = U.momentInUTC(endDate)
    let singleDateMoment = startDateMoment.clone()
    let finalWarningResponse = {
        added: [],
        removed: []
    }

    while (singleDateMoment.isSameOrBefore(endDateMoment)) {
        let warningResponse = {
            added: [],
            removed: []
        }

        let warningsAskedForLeave = await WarningModel.findOne({
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            'employeeDays.date': singleDateMoment.toDate(),
            'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
        })
        logger.debug("inside-leaveDelete warning model=> warningsAskedForLeave", {warningsAskedForLeave})
        if (warningsAskedForLeave) {
            let count = await MDL.LeaveModel.count({
                "_id": {$ne: leave._id},
                'user._id': employee._id,
                'startDate': {$lte: singleDateMoment.toDate()},
                'endDate': {$gte: singleDateMoment.toDate()},
                'status': SC.LEAVE_STATUS_RAISED
            })
            logger.debug("[leave Deleted ]=>[ warning delete] => check other raised leave exists in this date range startDate :[" + startDate + "]  endDate :[" + endDate + "] :", {count})
            if (count == 0) {
                let deleteWarningResponse = await deleteWarningWithResponse(warningsAskedForLeave, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
                if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                    warningResponse.added.push(...deleteWarningResponse.added)
                if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                    warningResponse.removed.push(...deleteWarningResponse.removed)

            }
        }

        let warningsOnLeave = await WarningModel.findOne({
            type: SC.WARNING_EMPLOYEE_ON_LEAVE,
            'employeeDays.date': singleDateMoment.toDate(),
            'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
        })

        logger.debug("inside-leaveDelete warning model=> warningsOnLeave", {warningsOnLeave})
        if (warningsOnLeave) {
            let count = await MDL.LeaveModel.count({
                "_id": {$ne: leave._id},
                'user._id': employee._id,
                'startDate': {$lte: singleDateMoment.toDate()},
                'endDate': {$gte: singleDateMoment.toDate()},
                'status': SC.LEAVE_STATUS_APPROVED
            })
            logger.debug("[leave Deleted ]=>[ warning delete] => check other approved leave exists in this date range startDate :[" + startDate + "]  endDate :[" + endDate + "] :", {count})
            if (count == 0) {
                let deleteWarningResponse = await deleteWarningWithResponse(warningsOnLeave, SC.WARNING_EMPLOYEE_ON_LEAVE)
                if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                    warningResponse.added.push(...deleteWarningResponse.added)
                if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                    warningResponse.removed.push(...deleteWarningResponse.removed)

            }
        }
        singleDateMoment = singleDateMoment.add(1, 'days')
        if (warningResponse.added && warningResponse.added.length)
            finalWarningResponse.added.push(...warningResponse.added)
        if (warningResponse.removed && warningResponse.removed.length)
            finalWarningResponse.removed.push(...warningResponse.removed)

    }
    return finalWarningResponse
}


warningSchema.statics.leaveApproved = async (startDate, endDate, employee) => {
    let startDateMoment = U.momentInUTC(startDate)
    let endDateMoment = U.momentInUTC(endDate)
    let singleDateMoment = startDateMoment.clone()

    let warningResponse = {
        added: [],
        removed: []
    }
    /*---------------------Employee On Leave ----------------------*/

    while (singleDateMoment.isSameOrBefore(endDateMoment)) {

        let employeeAskForLeaveWarning = await WarningModel.findOne({
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            'employeeDays.date': singleDateMoment.toDate(),
            'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
        })

        if (employeeAskForLeaveWarning) {
            logger.debug("inside-leaveApproved=> employeeAskForLeaveWarning", {employeeAskForLeaveWarning})
            //delete employeeAskForLeaveWarning and receiving its warning to newWarningResponse
            let deleteWarningResponse = await deleteWarningWithResponse(employeeAskForLeaveWarning, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)
        }

        //create new warning for employee on leave

        let newWarning = new WarningModel()
        let taskPlans = await MDL.TaskPlanningModel.find({
            'planningDate': singleDateMoment.toDate(),
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })
        taskPlans.forEach(tp => {
            warningResponse.added.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        })

        let distinctReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
            'planningDate': singleDateMoment.toDate(),
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        let releasesPromises = distinctReleaseIDs.map(releaseID => {
            return MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID)).then(releaseDetail => {
                warningResponse.added.push({
                    _id: releaseDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
                return Object.assign({}, releaseDetail.toObject(), {
                    source: true
                })

            })
        })

        let releases = await Promise.all(releasesPromises)


        let distinctReleasePlansIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
            'planningDate': singleDateMoment.toDate(),
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        let releasePlansPromises = distinctReleasePlansIDs.map(releasePlanID => {
            return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID)).then(releasePlanDetail => {
                warningResponse.added.push({
                    _id: releasePlanDetail._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
                return Object.assign({}, releasePlanDetail.toObject(), {
                    source: true
                })

            })
        })
        let employeeDay = {
            employee: Object.assign({}, employee, {name: employee.firstName + ' ' + employee.lastName}),
            dateString: singleDateMoment.format(SC.DATE_FORMAT),
            date: singleDateMoment.toDate()
        }

        let releasePlans = await Promise.all(releasePlansPromises)
        newWarning.type = SC.WARNING_EMPLOYEE_ON_LEAVE
        newWarning.taskPlans = [...taskPlans]
        newWarning.releasePlans = [...releasePlans]
        newWarning.releases = [...releases]
        newWarning.employeeDays = [employeeDay]
        await newWarning.save()
        //warning already exists for that day no need to do any thing
        singleDateMoment = singleDateMoment.add(1, 'days')
    }


    return warningResponse
}
/*
* |____________________________________________________________________LEAVE_END____________________________________________________________________|
*/

/*
|_________________________________________________MERGE TASK START___________________________________________________________
 */

const updateEmployeeAskForLeaveOnMergeTaskPlan = async (taskPlan, releasePlan, release, existingPlanedDate, rePlannedDate, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }
    /* Deletion of task plan with old date from employee ask for leave warning if available */
    let employeeAskForLeaveWarningOfExistingDate = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDays.date': existingPlanedDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeAskForLeaveWarningOfExistingDate) {
        //update warning WARNING_EMPLOYEE_ASK_FOR_LEAVE
        employeeAskForLeaveWarningOfExistingDate.taskPlans = employeeAskForLeaveWarningOfExistingDate.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            source: true
        })
        if (employeeAskForLeaveWarningOfExistingDate.taskPlans && employeeAskForLeaveWarningOfExistingDate.taskPlans.length && employeeAskForLeaveWarningOfExistingDate.taskPlans.length === 1) {

            let deleteWarningResponse = await deleteWarningWithResponse(employeeAskForLeaveWarningOfExistingDate, SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)

        } else {
            if (employeeAskForLeaveWarningOfExistingDate.taskPlans && employeeAskForLeaveWarningOfExistingDate.taskPlans.length && employeeAskForLeaveWarningOfExistingDate.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) > -1) {
                employeeAskForLeaveWarningOfExistingDate.releasePlans = employeeAskForLeaveWarningOfExistingDate.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            }
            if (employeeAskForLeaveWarningOfExistingDate.taskPlans && employeeAskForLeaveWarningOfExistingDate.taskPlans.length && employeeAskForLeaveWarningOfExistingDate.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) > -1) {
                employeeAskForLeaveWarningOfExistingDate.releases = employeeAskForLeaveWarningOfExistingDate.releases.filter(r => r._id.toString() !== release._id.toString())
                warningResponse.removed.push({
                    _id: release._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            }
            await employeeAskForLeaveWarningOfExistingDate.save()
        }
    }


    let employeeAskForLeaveWarningOfNewDate = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDays.date': rePlannedDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeAskForLeaveWarningOfNewDate) {

        //update warning WARNING_EMPLOYEE_ASK_FOR_LEAVE
        employeeAskForLeaveWarningOfNewDate.taskPlans = [...employeeAskForLeaveWarningOfNewDate.taskPlans, Object.assign({}, taskPlan.toObject(), {source: true})]
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            source: true
        })


        if (employeeAskForLeaveWarningOfNewDate.releasePlans && employeeAskForLeaveWarningOfNewDate.releasePlans.length && employeeAskForLeaveWarningOfNewDate.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) === -1) {
            employeeAskForLeaveWarningOfNewDate.releasePlans = [...employeeAskForLeaveWarningOfNewDate.releasePlans, Object.assign({}, releasePlan.toObject(), {source: true})]
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        }
        if (employeeAskForLeaveWarningOfNewDate.releases && employeeAskForLeaveWarningOfNewDate.releases.length && employeeAskForLeaveWarningOfNewDate.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
            employeeAskForLeaveWarningOfNewDate.releases = [...employeeAskForLeaveWarningOfNewDate.releases, Object.assign({}, release.toObject(), {source: true})]
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        }
        await employeeAskForLeaveWarningOfNewDate.save()
    } else {
        let leaves = await MDL.LeaveModel.find({
            'user._id': mongoose.Types.ObjectId(employee._id),
            'startDate': {$gte: rePlannedDate},
            'endDate': {$lte: rePlannedDate},
            'status': SC.LEAVE_STATUS_RAISED
        })
        if (leaves && leaves.length) {
            let newEmployeeAskForLeaveWarningOfNewDate = new WarningModel()
            newEmployeeAskForLeaveWarningOfNewDate.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            newEmployeeAskForLeaveWarningOfNewDate.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            newEmployeeAskForLeaveWarningOfNewDate.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            newEmployeeAskForLeaveWarningOfNewDate.releases = [Object.assign({}, release.toObject(), {source: true})]
            newEmployeeAskForLeaveWarningOfNewDate.employeeDays = [Object.assign({}, employee.toObject(), {
                source: true,
                name: employee.firstName + ' ' + employee.lastName,
                dateString: U.formatDateInUTC(rePlannedDate),
                date: rePlannedDate
            })]

            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
            await newEmployeeAskForLeaveWarningOfNewDate.save()
        }
    }
    return warningResponse
}


const updateEmployeeOnLeaveOnMergeTaskPlan = async (taskPlan, releasePlan, release, existingPlanedDate, rePlannedDate, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeOnLeaveWarningOfExistingDate = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ON_LEAVE,
        'employeeDays.date': existingPlanedDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeOnLeaveWarningOfExistingDate) {
        //update warning WARNING_EMPLOYEE_ON_LEAVE
        employeeOnLeaveWarningOfExistingDate.taskPlans = employeeOnLeaveWarningOfExistingDate.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ON_LEAVE,
            source: true
        })
        if (employeeOnLeaveWarningOfExistingDate.taskPlans && employeeOnLeaveWarningOfExistingDate.taskPlans.length && employeeOnLeaveWarningOfExistingDate.taskPlans.length === 1) {
            let deleteWarningResponse = await deleteWarningWithResponse(employeeOnLeaveWarningOfExistingDate, SC.WARNING_EMPLOYEE_ON_LEAVE)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)

        } else {
            if (employeeOnLeaveWarningOfExistingDate.taskPlans && employeeOnLeaveWarningOfExistingDate.taskPlans.length && employeeOnLeaveWarningOfExistingDate.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) > -1) {
                employeeOnLeaveWarningOfExistingDate.releasePlans = employeeOnLeaveWarningOfExistingDate.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }
            if (employeeOnLeaveWarningOfExistingDate.taskPlans && employeeOnLeaveWarningOfExistingDate.taskPlans.length && employeeOnLeaveWarningOfExistingDate.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) > -1) {
                employeeOnLeaveWarningOfExistingDate.releases = employeeOnLeaveWarningOfExistingDate.releases.filter(r => r._id.toString() !== release._id.toString())
                warningResponse.removed.push({
                    _id: release._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }
            await employeeOnLeaveWarningOfExistingDate.save()
        }

    }

    let employeeOnLeaveWarningOfNewDate = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ON_LEAVE,
        'employeeDays.date': rePlannedDate,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    if (employeeOnLeaveWarningOfNewDate) {

        //update warning WARNING_EMPLOYEE_ON_LEAVE
        employeeOnLeaveWarningOfNewDate.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ON_LEAVE,
            source: true
        })

        if (employeeOnLeaveWarningOfNewDate.releasePlans && employeeOnLeaveWarningOfNewDate.releasePlans.length && employeeOnLeaveWarningOfNewDate.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) > -1) {
            employeeOnLeaveWarningOfNewDate.releasePlans.push(Object.assign({}, releasePlan.toObject(), {source: true}))
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        }
        if (employeeOnLeaveWarningOfNewDate.releases && employeeOnLeaveWarningOfNewDate.releases.length && employeeOnLeaveWarningOfNewDate.releases.findIndex(r => r._id.toString() === release._id.toString()) > -1) {
            employeeOnLeaveWarningOfNewDate.releases.push(Object.assign({}, release.toObject(), {source: true}))
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        }

        await employeeOnLeaveWarningOfNewDate.save()


    } else {
        let leaves = await MDL.LeaveModel.find({
            'user._id': mongoose.Types.ObjectId(employee._id),
            'startDate': {$gte: rePlannedDate},
            'endDate': {$lte: rePlannedDate},
            'status': SC.LEAVE_STATUS_APPROVED
        })

        if (leaves && leaves.length) {

            let newEmployeeOnLeaveWarningOfNewDate = new WarningModel()
            newEmployeeOnLeaveWarningOfNewDate.type = SC.WARNING_EMPLOYEE_ON_LEAVE
            newEmployeeOnLeaveWarningOfNewDate.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            newEmployeeOnLeaveWarningOfNewDate.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            newEmployeeOnLeaveWarningOfNewDate.releases = [Object.assign({}, release.toObject(), {source: true})]
            newEmployeeOnLeaveWarningOfNewDate.employeeDays = [Object.assign({}, employee.toObject(), {
                source: true,
                name: employee.firstName + ' ' + employee.lastName,
                dateString: U.formatDateInUTC(rePlannedDate),
                date: rePlannedDate
            })]

            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
            await newEmployeeOnLeaveWarningOfNewDate.save()
        }
    }
    return warningResponse
}

// Generate warnings when task is merged
warningSchema.statics.taskPlanMerged = async (taskPlan, releasePlan, release, existingEmployeeDays, rePlannedEmployeeDays, selectedEmployee) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)
    let momentRePlan = U.momentFromDateInUTC(rePlannedEmployeeDays.date)
    /*TOO_MANY_HOURS WARNING UPDATE SECTION*/

    // as task is moved there is possibility of removal of too many hours warning if not removed then also task plan will be removed from warning`s task plan list
    logger.debug("[ taskPlanMerged ]:()=> Too many hours warning would be removed from existing date (if exists)", {existingEmployeeDays})

    let deleteTooManyHoursWarningResponse = await deleteTooManyHours(taskPlan, releasePlan, release, existingEmployeeDays.date)
    logger.debug("", {deleteTooManyHoursWarningResponse})

    warningResponse.added.push(...deleteTooManyHoursWarningResponse.added)
    warningResponse.removed.push(...deleteTooManyHoursWarningResponse.removed)


    // as task is moved to new date there is possibility of adding too many hours warning
    if (rePlannedEmployeeDays.plannedHours > maxPlannedHoursNumber) {
        logger.debug("[ taskPlanMerged ]:()=> Too many hours warning would be raised for rePlanning date", {rePlannedEmployeeDays})

        let addTooManyHoursWarningResponse = await addTooManyHours(taskPlan, releasePlan, release, rePlannedEmployeeDays.employee, momentRePlan)
        logger.debug("", {addTooManyHoursWarningResponse})

        warningResponse.added.push(...addTooManyHoursWarningResponse.added)
        warningResponse.removed.push(...addTooManyHoursWarningResponse.removed)
    }
    /*EMPLOYEE_ASK_FOR_LEAVE WARNING UPDATE SECTION*/

    let warningsAskForLeave = await updateEmployeeAskForLeaveOnMergeTaskPlan(taskPlan, releasePlan, release, existingEmployeeDays.date, rePlannedEmployeeDays.date, selectedEmployee)
    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)
    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)


    /*EMPLOYEE_ON_LEAVE WARNING UPDATE SECTION*/
    let warningsOnLeave = await updateEmployeeOnLeaveOnMergeTaskPlan(taskPlan, releasePlan, release, existingEmployeeDays.date, rePlannedEmployeeDays.date, selectedEmployee)

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)
    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)

    return warningResponse
}


const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
