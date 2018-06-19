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


warningSchema.statics.getWarnings = async (releaseID, user) => {
    //

    let release = await MDL.ReleaseModel.findById(releaseID)
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
    return await WarningModel.find({'releases._id': releaseID})
}

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


warningSchema.statics.removeUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}


const addTooManyHours = async (taskPlan, release, releasePlan, employee, momentPlanningDate) => {
    //logger.info('toManyHoursWarning():  ')
    /**
     * It is possible that this warning is raised earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */

    let warningResponse = {
        added: [],
        removed: []
    }

    let planningDateUtc = U.dateInUTC(momentPlanningDate)
    /* A task plan which is going to be created */
    let currentTaskPlan = {
        _id: taskPlan._id,
        release: {
            _id: release.toObject()._id,
        },
        releasePlan: {
            _id: releasePlan.toObject()._id,
        },
        source: true
    }
    /* See if there is already a too many hours warning */
    let tooManyHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': momentPlanningDate.toDate(),
        'employeeDays.employee._id': mongoose.Types.ObjectId(employee._id)
    })

    //logger.debug('WarningModel.addTooManyHours(): existing warning ', {tooManyHoursWarning})
    if (tooManyHoursWarning) {
        //logger.debug('too many hours warning already exists')
        /* Update Existing warning WARNING_TOO_MANY_HOURS of same employee and planned date */
        /* Check current release is available in release list of warning if not available then push it to list*/
        if (tooManyHoursWarning.releases.findIndex(r => r && r._id && release.toObject()._id && r._id.toString() === release.toObject()._id.toString()) === -1) {
            tooManyHoursWarning.releases.push(Object.assign({}, release.toObject(), {
                source: true
            }))

            warningResponse.added.push({
                _id: release._id,
                warningType: SC.WARNING_TYPE_RELEASE,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })
        }

        /* Check current releasePlan is available in releasePlan list of warning if not available then push it to list*/
        if (tooManyHoursWarning.releasePlans.findIndex(rp => rp && rp._id && releasePlan.toObject()._id && rp._id.toString() === releasePlan.toObject()._id.toString()) === -1) {
            tooManyHoursWarning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {
                source: true
            }))

            warningResponse.added.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })
        }

        tooManyHoursWarning.taskPlans.push(currentTaskPlan)

        await tooManyHoursWarning.save()

        warningResponse.added.push({
            _id: currentTaskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_TOO_MANY_HOURS,
            source: true
        })

    } else {
        /* create a new warning :- WARNING_TOO_MANY_HOURS -: warning for selected developer and selected date as a planned date*/
        let newWarning = new WarningModel()
        let employeeDays = await MDL.EmployeeDaysModel.find({
            'date': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        // find out release ids added in current task plans of same day/same employee as those would be affected by this warning
        let distinctReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        if (distinctReleaseIDs && distinctReleaseIDs.length) {
            if (distinctReleaseIDs.findIndex(d => d.toString() == release._id.toString()) == -1)
                distinctReleaseIDs.push(release._id) // adding release of current task plan if not already there

        } else {
            distinctReleaseIDs = [release._id]
        }
        //logger.debug('distinct released ids ', {distinctReleaseIDs})

        let releasesPromises = distinctReleaseIDs.map(releaseID => {
            return MDL.ReleaseModel.findById(releaseID).then(releaseDetail => {
                //logger.debug('releaseDetail', {releaseDetail})
                if (releaseDetail && releaseDetail._id.toString() === release.toObject()._id.toString()) {
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
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        if (distinctReleasePlanIDs && distinctReleasePlanIDs.length) {
            if (distinctReleaseIDs.findIndex(d => d.toString() == releasePlan._id.toString()) == -1)
                distinctReleasePlanIDs.push(releasePlan._id) // adding release plan of current task plan if not already there

        } else {
            distinctReleasePlanIDs = [releasePlan._id]
        }
        //logger.debug('distinct released plan ids ', {distinctReleasePlanIDs})

        let releasePlanPromises = distinctReleasePlanIDs.map(releasePlanID => {
            return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID)).then(releasePlanDetail => {
                //logger.debug('releasePlanDetail', {releasePlanDetail})
                if (releasePlanDetail._id.toString() === releasePlan.toObject()._id.toString()) {

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
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        warningResponse.added.push({
            _id: currentTaskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_TOO_MANY_HOURS,
            source: true
        })

        taskPlans.forEach(t => {
            warningResponse.added.push({
                _id: t._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: false
            })
        })

        newWarning.type = SC.WARNING_TOO_MANY_HOURS
        newWarning.taskPlans = [...taskPlans, currentTaskPlan]
        newWarning.releasePlans = [...releasePlans]
        newWarning.releases = [...releases]
        newWarning.employeeDays = [...employeeDays]
        await newWarning.save()
    }
    return warningResponse
}


/**
 * Called when any task is planned
 */
warningSchema.statics.taskPlanAdded = async (taskPlan, releasePlan, release, employee, plannedHourNumber, momentPlanningDate, firstTaskOfReleasePlan, addedAfterMaxDate) => {
    // See if this addition of planning causes too many hours warning
    // Check if planned hours crossed limit of maximum hours as per configuration, if yes generate too many hours warning
    //logger.debug('warning.taskPlanned(): on adding planned hours for task planning check for task planning is having too many hours or not')
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})

    //logger.debug('warning.taskPlanned(): employeeSetting', {bk1: employeeSetting})
    //logger.debug('warning.taskPlanned(): employeeSetting.maxPlannedHours', {bk2: employeeSetting.maxPlannedHours})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let employeeDay = await MDL.EmployeeDaysModel.findOne({
        'date': momentPlanningDate,
        'employee._id': mongoose.Types.ObjectId(employee._id)
    })

    let warningResponse = {
        added: [],
        removed: []
    }

   // logger.debug('warning.taskPlanned(): employeeDay', {bk3: employeeDay})
    if (plannedHourNumber > maxPlannedHoursNumber || employeeDay.plannedHours > maxPlannedHoursNumber) {
        let warningsTooManyHours = await addTooManyHours(taskPlan, release, releasePlan, employee, momentPlanningDate)
        if (warningsTooManyHours.added && warningsTooManyHours.added.length)
            warningResponse.added.push(...warningsTooManyHours.added)
        if (warningsTooManyHours.removed && warningsTooManyHours.removed.length)
            warningResponse.removed.push(...warningsTooManyHours.removed)
    }

    if (firstTaskOfReleasePlan) {
        // If this is first task planned against a release plan, unplanned warning would be removed from release plan
        //logger.debug('warning.taskPlanned(): this is first task of release')
        // since this is first task of release plan, unplanned warning would be removed from release plan
        let unplannedWarnings = await WarningModel.find({
            type: SC.WARNING_UNPLANNED,
            'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
        })

        //logger.debug('warning.taskPlanned(): unplanned warnings ', {unplannedWarnings})

        if (unplannedWarnings && unplannedWarnings.length) {
            let unplannedWarningPromises = unplannedWarnings.map(up => {
                return up.remove()
            })
            let unplannedResult = await Promise.all(unplannedWarningPromises)

            warningResponse.removed.push({
                _id: taskPlan.releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_UNPLANNED
            })
        }
    }

    if (addedAfterMaxDate) {

        //logger.debug('warning.taskPlanned(): task is planned after maximum planned date')

        /**
         * Since this planning is added after max planning date, if there are pending on end date warning remove those
         */

        let pendingOnEndDateWarning = await WarningModel.findOne({
            type: SC.WARNING_PENDING_ON_END_DATE,
            'releasePlans': {
                '$elemMatch': {
                    _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                    'employee._id': taskPlan.employee._id
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

        let completedBeforeEndDateWarning = await WarningModel.findOne({
            type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
            'releasePlans': {
                '$elemMatch': {
                    _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                    'employee._id': taskPlan.employee._id
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

    warningResponse = await updateEmployeeAskForLeaveOnAddTaskPlan(taskPlan, releasePlan, release, employee, momentPlanningDate, warningResponse)
    return warningResponse
}


/**
 * Called when task plan is removed. Make necessary warning changes
 *
 */
const deleteToManyHours = async (taskPlan, releasePlan, release, plannedDateUTC) => {
    /**
     * It is possible that this warning is  earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */
    let warningResponse = {
        added: [],
        removed: []
    }
    let employeeDay = await MDL.EmployeeDaysModel.findOne({
        'employee._id': taskPlan.employee._id,
        'date': plannedDateUTC
    })
//fetch employee setting
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let employeeID = employeeDay.employee._id

    let tooManyHourWarning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': plannedDateUTC,
        'employeeDays.employee._id': mongoose.Types.ObjectId(employeeID)
    })

    if (tooManyHourWarning) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS*/
        if (employeeDay && employeeDay.plannedHours && Number(employeeDay.plannedHours) <= maxPlannedHoursNumber) {
            //tooManyHourWarning reponse calculation
            warningResponse = await deleteWarningWithResponse(tooManyHourWarning, warningResponse, SC.WARNING_TOO_MANY_HOURS)
        } else {
            tooManyHourWarning.taskPlans = tooManyHourWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())

            warningResponse.removed.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_TOO_MANY_HOURS,
                source: true
            })

            if (tooManyHourWarning.taskPlans && tooManyHourWarning.taskPlans.length) {
                let otherTaskPlanReleaseExists = false

                otherTaskPlanReleaseExists = tooManyHourWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) !== -1
                if (!otherTaskPlanReleaseExists) {
                    tooManyHourWarning.releases = tooManyHourWarning.releases.filter(r => r._id.toString() !== release._id.toString())
                    warningResponse.removed.push({
                        _id: release._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: true
                    })
                }

                let otherTaskPlanReleasePlanExists = false
                otherTaskPlanReleasePlanExists = tooManyHourWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) !== -1
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
                warningResponse = await deleteWarningWithResponse(tooManyHourWarning, warningResponse, SC.WARNING_TOO_MANY_HOURS)
            }
        }
    } else {
        // As per current code that is called without any precondition, it is possible that no warning exists with too many hours so commenting code to throw error

        //throw new AppError('Warning is not available to delete ', EC.DATA_INCONSISTENT, EC.HTTP_BAD_REQUEST)
    }
    return warningResponse
}


const updateEmployeeAskForLeaveOnAddTaskPlan = async (taskPlan, releasePlan, release, employee, momentPlanningDate, warningResponse) => {
    let EmployeeAskForLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDay.date': momentPlanningDate,
        'employeeDay.employee._id': employee._id
    })

    if (EmployeeAskForLeaveWarning) {
        //update warning WARNING_EMPLOYEE_ASK_FOR_LEAVE
        EmployeeAskForLeaveWarning.taskPlans = [...EmployeeAskForLeaveWarning.taskPlans, taskPlan]
        EmployeeAskForLeaveWarning.releasePlans = EmployeeAskForLeaveWarning.releasePlans && EmployeeAskForLeaveWarning.releasePlans.length && EmployeeAskForLeaveWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) ? [...EmployeeAskForLeaveWarning.releasePlans] : [...EmployeeAskForLeaveWarning.releasePlans, releasePlan]
        EmployeeAskForLeaveWarning.releases = EmployeeAskForLeaveWarning.releases && EmployeeAskForLeaveWarning.releases.length && EmployeeAskForLeaveWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) ? [...EmployeeAskForLeaveWarning.releases] : [...EmployeeAskForLeaveWarning.releases, release]
        await EmployeeAskForLeaveWarning.save()
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
    } else {
        // Check that any leave available for that day of selected employee

    }
    return warningResponse
}
const deleteWarningWithResponse = async (warning, warningResponse, warningType) => {

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
    warning.releasePlans.forEach(rp => {
        if (rp) {
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
    await WarningModel.findByIdAndRemove(warning._id)
    return warningResponse
}


warningSchema.statics.taskPlanDeleted = async (taskPlan, releasePlan, release, plannedHourNumber) => {
    /* As task plan is removed it is possible that there is no planning left for this release plan so check that and see if unplanned warning/flag needs to
     be added again
   */
    let warningResponse = {
        added: [],
        removed: []
    }

    let deleteTooManyHoursWarningResponse = undefined
    let plannedDateUTC = U.dateInUTC(taskPlan.planningDateString)
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
    deleteTooManyHoursWarningResponse = await deleteToManyHours(taskPlan, releasePlan, release, plannedDateUTC)
    warningResponse.added = [...warningResponse.added, ...deleteTooManyHoursWarningResponse.added]
    warningResponse.removed = [...warningResponse.removed, ...deleteTooManyHoursWarningResponse.removed]
    return warningResponse
}

/**
 * Task reported as pending on end date, see what warning changes can be made
 * @param taskPlan
 * @returns {Promise.<*>}
 */

warningSchema.statics.taskReportedAsPending = async (taskPlan, onEndDate) => {
    //logger.debug('taskReportedAsPendingOnEndDate(): taskplan ', {taskPlan})

    var warningResponse = {
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
                        'employee._id': taskPlan.employee._id
                    }
                }
            })

        //logger.debug('taskReportedAsPendingOnEndDate(): existing warning ', {pendingOnEndDateWarning})

        if (pendingOnEndDateWarning) {
            // there is already a pending on end date warning
            if (!pendingOnEndDateWarning.taskPlans || pendingOnEndDateWarning.taskPlans.findIndex(t => {
                    return t._id.toString() === taskPlan._id.toString()
                }) === -1) {

                // add task plan against this warning

                pendingOnEndDateWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
                warningResponse.added.push({
                    _id: taskPlan._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    source: true,
                    type: SC.WARNING_PENDING_ON_END_DATE
                })


                // since this task plan was not already part of this warning we would have to see if addition of this task plan would cause new release/releaseplan against this warning

                if (!pendingOnEndDateWarning.releases || pendingOnEndDateWarning.releases.findIndex(r => {
                        return r._id.toString() === taskPlan.release._id.toString()
                    }) === -1) {
                    let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
                    pendingOnEndDateWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
                    warningResponse.added.push({
                        _id: release._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        source: true,
                        type: SC.WARNING_PENDING_ON_END_DATE
                    })

                }

                if (!pendingOnEndDateWarning.releasePlans || pendingOnEndDateWarning.releasePlans.findIndex(r => {
                        return r._id.toString() === taskPlan.releasePlan._id.toString()
                    }) === -1) {
                    let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
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

            let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
            //logger.debug('taskReportedAsPendingOnEndDate(): ', {release})
            pendingOnEndDateWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
            let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
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
        let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
        //logger.debug('taskReportedAsCompleted(): ', {release})
        completeBeforeWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
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


/**
 * Employee raised request for leave
 * @param startDate, endDate, user
 * @returns {Promise.<void>}
 */
warningSchema.statics.leaveAdded = async (startDate, endDate, employee) => {
    let startDateMoment = U.momentInUTC(startDate)
    let endDateMoment = U.momentInUTC(endDate)
    let singleDateMoment = startDateMoment.clone()

    let warningResponse = {
        added: [],
        removed: []
    }
    /*---------------------Employee Ask For leave ----------------------*/

    while (singleDateMoment.isSameOrBefore(endDateMoment)) {

        let warning = await WarningModel.findOne({
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            'employeeDay.date': singleDateMoment.toDate(),
            'employeeDay.employee._id': employee._id
        })
        if (!warning) {
            //create warning WARNING_EMPLOYEE_ASK_FOR_LEAVE for this date
            let newWarning = new WarningModel()
            let taskPlans = await MDL.TaskPlanningModel.find({
                'planningDate': singleDateMoment.toDate(),
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })
            taskPlans.forEach(tp => {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            })

            let distinctReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
                'planningDate': singleDateMoment.toDate(),
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })

            let releasesPromises = distinctReleaseIDs.map(releaseID => {
                return MDL.ReleaseModel.findById(releaseID).then(releaseDetail => {
                    warningResponse.added.push({
                        _id: releaseDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE,
                        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
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
                return MDL.ReleasePlanModel.findById(releasePlanID).then(releasePlanDetail => {
                    warningResponse.added.push({
                        _id: releasePlanDetail._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                        source: true
                    })
                    return Object.assign({}, releasePlanDetail.toObject(), {
                        source: true
                    })

                })
            })
            let employeeDay = {
                employee: employee,
                dateString: singleDateMoment.format(SC.DATE_FORMAT),
                date: singleDateMoment.toDate()
            }

            let releasePlans = await Promise.all(releasePlansPromises)
            newWarning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            newWarning.taskPlans = [...taskPlans]
            newWarning.releasePlans = [...releasePlans]
            newWarning.releases = [...releases]
            newWarning.employeeDays = [employeeDay]
            await newWarning.save()

        } else {
            //warning already exists for that day no need to do any thing
        }
        singleDateMoment = singleDateMoment.add(1, "days")
    }
    return warningResponse
}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
