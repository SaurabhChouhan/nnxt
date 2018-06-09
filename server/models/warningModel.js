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


warningSchema.statics.getWarnings = async (releasePlan) => {
    return await WarningModel.find({})
}

warningSchema.statics.addUnplanned = async (release, releasePlan) => {
    // TODO: Add appropriate validation
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

warningSchema.statics.addToManyHours = async (taskPlan, release, releasePlan, employeeDay, momentPlanningDate) => {
    // TODO: Add appropriate validation
    logger.info('toManyHoursWarning():  ')
    /**
     * It is possible that this warning is raised earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */

    let planningDateUtc = U.dateInUTC(momentPlanningDate)
    let employeeID = employeeDay && employeeDay.employee && employeeDay.employee._id ? employeeDay.employee._id : undefined
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
    /* fetch warning WARNING_TOO_MANY_HOURS of selected employee and planned date */
    let warning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': planningDateUtc,
        'employeeDays.employee_id': mongoose.Types.ObjectId(employeeID)
    })

    logger.debug('warning after fetch is available or not', {warning})

    if (warning) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS of same employee and planned date */
        /* Check current release is available in release list of warning if not available then push it to list*/
        if (warning.releases.findIndex(r => r && r._id && release.toObject()._id && r._id.toString() === release.toObject()._id.toString()) === -1) {
            warning.releases.push(Object.assign({}, release.toObject(), {
                source: true
            }))
        }

        /* Check current releasePlan is available in releasePlan list of warning if not available then push it to list*/
        if (warning.releasePlans.findIndex(rp => rp && rp._id && releasePlan.toObject()._id && rp._id.toString() === releasePlan.toObject()._id.toString()) === -1) {
            warning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {
                source: true
            }))
        }

        warning.taskPlans.push(currentTaskPlan)
        return await warning.save()


    } else {
        /* create a new warning :- WARNING_TOO_MANY_HOURS -: warning for selected developer and selected date as a planned date*/
        let newWarning = new WarningModel()
        let employeeDays = await MDL.EmployeeDaysModel.find({
            'date': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employeeID)
        })

        let taskPlans = await MDL.TaskPlanningModel.find({
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employeeID)
        })

        if (taskPlans.length > 0) {
            logger.debug('taskPlans of selected employee and selected date', {taskPlans})

            /*All release fetch which are involved in these task plan list with source true and others with source false*/
            let uniqueTaskPlansByReleases = _.uniqBy(taskPlans, 'release._id')
            logger.debug('uniqueTaskPlansByReleases', {uniqueTaskPlansByReleases})
            let releasesPromises = uniqueTaskPlansByReleases.map(taskPlanParam => {
                return MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlanParam.release._id)).then(releaseDetail => {
                    logger.debug('releaseDetail', {releaseDetail})
                    if (releaseDetail && releaseDetail._id.toString() === release.toObject()._id.toString()) {
                        return Object.assign({}, releaseDetail.toObject(), {
                            source: true
                        })
                    } else {
                        return Object.assign({}, releaseDetail.toObject(), {
                            source: false
                        })
                    }
                })

            })
            let releases = await Promise.all(releasesPromises)
            logger.debug('releases', {releases})

            /*All releasePlan fetch which are involved in these task plan list with source true and others with source false*/

            let uniqueTaskPlansByReleasePlans = _.uniqBy(taskPlans, 'releasePlan._id')
            logger.debug('uniqueTaskPlansByReleasePlans', {uniqueTaskPlansByReleasePlans})
            let releasePlansPromises = uniqueTaskPlansByReleases.map(taskPlanParam => {
                return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlanParam.releasePlan._id)).then(releasePlanDetail => {
                    logger.debug('releasePlanDetail', {releasePlanDetail})
                    if (releasePlanDetail._id.toString() === releasePlan.toObject()._id.toString()) {
                        return Object.assign({}, releasePlanDetail.toObject(), {
                            source: true
                        })
                    } else {
                        return Object.assign({}, releasePlanDetail.toObject(), {
                            source: false
                        })
                    }
                })
            })

            logger.debug('releasePlansPromises :-', {releasePlansPromises})
            let releasePlans = await Promise.all(releasePlansPromises)
            logger.debug('releasesPlans :- ', {releasePlans})

            newWarning.type = SC.WARNING_TOO_MANY_HOURS,
                newWarning.taskPlans = [...taskPlans, currentTaskPlan],
                newWarning.releasePlans = releasePlans && releasePlans.length && releasePlans.findIndex(rp => rp._id.toString() === releasePlan.toObject()._id.toString()) != -1 ? releasePlans : [...releasePlans, releasePlan.toObject()],
                newWarning.releases = releases && releases.length && releases.findIndex(r => r._id.toString() === releasePlan.toObject()._id.toString()) != -1 ? releases : [...releases, release.toObject()],
                newWarning.employeeDays = employeeDays

        } else {
            newWarning.type = SC.WARNING_TOO_MANY_HOURS,
                newWarning.taskPlans = [Object.assign({}, currentTaskPlan, {source: true})],
                newWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})],
                newWarning.releases = [Object.assign({}, release.toObject(), {source: true})],
                newWarning.employeeDays = employeeDays && employeeDays.length ? employeeDays : [Object.assign({}, employeeDay, {source: true})]

        }

        logger.debug('warning which have to create:- ', {newWarning})
        return await newWarning.save()
    }
}


warningSchema.statics.deleteToManyHours = async (taskPlan, release, releasePlan, employeeDay, plannedDate) => {
    // TODO: Add appropriate validation
    /**
     * It is possible that this warning is  earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
     * Check to see if employee days of this taskPlan already has this warning raised
     */
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let planningDateUtc = U.dateInUTC(plannedDate)
    let employeeID = employeeDay.employee && employeeDay.employee._id ? employeeDay.employee._id : undefined
    console.log('planningDateUtc', planningDateUtc)
    let warning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDays.date': planningDateUtc,
        'employeeDays.employee_id': mongoose.Types.ObjectId(employeeID)
    })

    if (!warning) {
        throw new AppError('Warning is not available to delete ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (warning && warning.taskPlans && warning.taskPlans.length > 1) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS*/
        if (employeeDay && employeeDay.plannedHours && Number(employeeDay.plannedHours) <= maxPlannedHoursNumber) {
            return await WarningModel.findByIdAndRemove(warning._id)
        }
        warning.taskPlans = warning.taskPlans.filter(tp => tp && tp._id && taskPlan && taskPlan.toObject()._id && tp._id.toString() != taskPlan.toObject()._id.toString())
        let otherTaskPlanReleaseExists = false
        otherTaskPlanReleaseExists = warning.taskPlans.findIndex(tp => tp && tp.release && tp.release._id.toString() != release.toObject()._id.toString()) != -1
        if (!otherTaskPlanReleaseExists) {
            warning.releases = warning.releases.filter(r => r._id.toString() != release._id.toString())
        }
        let otherTaskPlanReleasePlanExists = false
        otherTaskPlanReleasePlanExists = warning.taskPlans.findIndex(tp => tp && tp.releasePlan && tp.releasePlan._id.toString() != releasePlan.toObject()._id.toString()) != -1
        if (!otherTaskPlanReleasePlanExists) {
            warning.releasePlans = warning.releasePlans.filter(r => r._id.toString() != releasePlan._id.toString())
        }
        return await warning.save()
    } else {
        return await WarningModel.findByIdAndRemove(warning._id)
    }

}


warningSchema.statics.removeUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}

/**
 * Task reported as pending on end date, see what warning changes can be made
 * @param taskPlan
 * @returns {Promise.<*>}
 */

warningSchema.statics.taskReportedAsPending = async (taskPlan, onEndDate) => {
    logger.debug('taskReportedAsPendingOnEndDate(): taskplan ', {taskPlan})

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

        logger.debug('taskReportedAsPendingOnEndDate(): existing warning ', {pendingOnEndDateWarning})

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
            logger.debug('taskReportedAsPendingOnEndDate(): ', {release})
            pendingOnEndDateWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
            let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
            logger.debug('taskReportedAsPendingOnEndDate(): ', {releasePlan})
            pendingOnEndDateWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
                source: true,
                employee: {
                    _id: taskPlan.employee._id
                }
            })]
            pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
                source: true
            })]
            logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
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
    logger.debug('taskReportedAsCompleted(): ', {taskPlan}, {releasePlan}, {beforeEndDate})
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
        logger.debug('taskReportedAsCompleted(): ', {release})
        completeBeforeWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
        logger.debug('taskReportedAsCompleted(): ', {releasePlan})
        completeBeforeWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
            source: true,
            employee: {
                _id: taskPlan.employee._id
            }
        })]
        completeBeforeWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
        logger.debug('taskReportedAsCompleted():  creating warning ', {warning: completeBeforeWarning})

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

        logger.debug('taskReportedAsCompleted(): found [' + warningsPendingEndDate.length + '] pending on end date warnings')

        // remove all warnings

        let warningPendingEndDatePromises = warningsPendingEndDate.map(w => w.remove())

        let removedWarnings = await Promise.all(warningPendingEndDatePromises)

        logger.debug('taskReportedAsCompleted(): ', {removedWarnings})

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
        logger.debug('release plan ids ', {releasePlanIDs})

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
            //logger.debug('count promises are ', {promises})
            let promisesResult = await Promise.all(promises)
            logger.debug('count promises results are ', {promiseResult: promisesResult})
            if(promisesResult && promisesResult.length){
                promisesResult.forEach(p=>{
                    logger.debug('iterating on p ', {p})
                    if(p.count == 0){
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
 * @param startDateMoment, endDateMoment, user
 * @returns {Promise.<void>}
 */
warningSchema.statics.addEmployeeAskForLeave = async (startDateMoment, endDateMoment, user) => {
    let warnings = await WarningModel.find({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'employeeDay.date': {$gte: startDateMoment, $lte: endDateMoment},
        'employeeDay.employee_id': user._id
    })
    let releasePlans = []
    let releases = []
    let planningDate = new Date('2018-06-05')
    new Promise((resolve, reject) => {
        return resolve(false)
    })

}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
