import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import * as U from '../utils'
import logger from '../logger'
import * as MDL from '../models'
import _ from 'lodash'

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

warningSchema.statics.addUnplanned = async (release,releasePlan) => {
    // TODO: Add appropriate validation
    // unplanned warning would be raised against a single release and a single release plan
    let warning = {}
    warning.type = SC.WARNING_UNPLANNED
    warning.releases = [Object.assign({}, release, {
        source: true
    })],
    warning.releasePlans = [Object.assign({}, releasePlan, {
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
    //  logger.debug('toManyHoursWarning: taskplan ', {taskPlan})
    /**
     * It is possible that this warning is raised earlier as well like when task is reported as pending again on end date by other developer or same developer
     * Check to see if release plan of this task already has this warning raised
     */

    let planningDateUtc = U.dateInUTC(momentPlanningDate)
    let employeeID = employeeDay.employee._id
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
    let warning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDay.date': planningDateUtc,
        'employeeDay.employee_id': mongoose.Types.ObjectId(employeeID)
    })
    console.log("warning before", warning)
    if (warning) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS*/
        if (warning.releases.findIndex(r => r && r._id.toString() === release.toObject()._id.toString()) === -1) {
            warning.releases.push(Object.assign({}, release.toObject(), {
                source: true
            }))
        }
        if (warning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan.toObject()._id.toString()) === -1) {
            warning.releasePlans.push(Object.assign({}, releasePlan.toObject(), {
                source: true
            }))
        }
        warning.taskPlans.push(currentTaskPlan)

    } else {
        /* create a new WARNING_TOO_MANY_HOURS warning */

        let employeeDays = await MDL.EmployeeDaysModel.find({
            'date': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employeeID)
        })

        let taskPlans = await MDL.TaskPlanningModel.find({
            'planningDate': planningDateUtc,
            'employee._id': mongoose.Types.ObjectId(employeeID)
        })

        if (taskPlans.length > 0) {
        console.log("taskPlans", taskPlans)
            // all release fetch which are involed in these task plan list with source true
        let uniqueTaskPlansByReleases = _.uniqBy(taskPlans, 'release._id')
        console.log("uniqueTaskPlansByReleases", uniqueTaskPlansByReleases)
            let releasesPromises = uniqueTaskPlansByReleases.map(taskPlanParam => {
                return MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlanParam.release._id)).then(releaseDetail => {
                    if (releaseDetail.toObject()._id.toString() === release.toObject()._id.toString()) {
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
        console.log("releases", releases)

        //release plan fetch

        let uniqueTaskPlansByReleasePlans = _.uniqBy(taskPlans, 'releasePlan._id')
        console.log("uniqueTaskPlansByReleasePlans", uniqueTaskPlansByReleasePlans)
            let releasePlansPromises = uniqueTaskPlansByReleases.map(taskPlanParam => {
                return MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlanParam.releasePlan._id)).then(releasePlanDetail => {
                    if (releasePlanDetail.toObject()._id.toString() === releasePlan.toObject()._id.toString()) {
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

            console.log("releasePlansPromises", releasePlansPromises)
        let releasePlans = await Promise.all(releasePlansPromises)
        console.log("releasesPlans", releasePlans)
        warning = {
            type: SC.WARNING_TOO_MANY_HOURS,
                taskPlans: [...taskPlans, currentTaskPlan],
                releasePlans: releasePlans && releasePlans.length && releasePlans.findIndex(rp => rp._id.toString() === releasePlan.toObject()._id.toString()) != -1 ? releasePlans : [...releasePlans, releasePlan.toObject()],
                releases: releases && releases.length && releases.findIndex(r => r._id.toString() === releasePlan.toObject()._id.toString()) != -1 ? releases : [...releases, release.toObject()],
            employeeDays: employeeDays
        }
        } else {
            warning = {
                type: SC.WARNING_TOO_MANY_HOURS,
                taskPlans: [Object.assign({}, currentTaskPlan, {source: true})],
                releasePlans: [Object.assign({}, releasePlan.toObject(), {source: true})],
                releases: [Object.assign({}, release.toObject(), {source: true})],
                employeeDays: employeeDays && employeeDays.length ? employeeDays : [Object.assign({}, employeeDay, {source: true})]
            }
        }

        console.log("warning after", warning)
        console.log("warning.releases", warning.releases)
        console.log("warning.releases.project", warning.releases.project)
        return await WarningModel.create(warning)
    }

}


warningSchema.statics.deleteToManyHours = async (taskPlan, release, releasePlan, employeeDay, plannedDate) => {
    // TODO: Add appropriate validation
    //  logger.debug('toManyHoursWarning: taskplan ', {taskPlan})
    /**
     * It is possible that this warning is raised earlier as well like when task is reported as pending again on end date by other developer or same developer
     * Check to see if release plan of this task already has this warning raised
     */

    let planningDateUtc = U.dateInUTC(plannedDate)
    let employeeID = employeeDay.employee._id

    let warning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDay.date': planningDateUtc,
        'employeeDay.employee_id': mongoose.Types.ObjectId(employeeID)
    })
    if (warning && warning.taskPlans && warning.taskPlans.length > 1) {
        /* Update Existing warning WARNING_TOO_MANY_HOURS*/
        warning.taskPlans = warning.taskPlans.filter(tp => tp._id.toString() != taskPlan._id.toString())
        let otherTaskPlanReleaseExists = false
        otherTaskPlanReleaseExists = warning.taskPlans.findIndex(tp => tp.release && tp.release._id.toString() != release._id.toString()) != -1
        if (!otherTaskPlanReleaseExists) {
            warning.releases = warning.releases.filter(r => r._id.toString() != release._id.toString())
        }
        let otherTaskPlanReleasePlanExists = false
        otherTaskPlanReleasePlanExists = warning.taskPlans.findIndex(tp => tp.releasePlan && tp.releasePlan._id.toString() != releasePlan._id.toString()) != -1
        if (!otherTaskPlanReleasePlanExists) {
            warning.releasePlans = warning.releasePlans.filter(r => r._id.toString() != releasePlan._id.toString())
        }
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


    if (onEndDate) {
        // Task is reported as pending on end date so need to add pending-on-enddate warning
    /**
         * It is possible that this warning is raised earlier as well like when task is reported as pending again on end date by same developer
     * Check to see if release plan of this task already has this warning raised
         *
         * Please note that for a release plan with tasks planned against multiple employee this warning may be raised multiple times one for each
         * employee that has reported task as pending on end date
     */

            // Check to see if this warning already exists for this employee/plan combination
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
            if (!pendingOnEndDateWarning.taskPlans || pendingOnEndDateWarning.taskPlans.findIndex(t => {
                    return t._id.toString() === taskPlan._id.toString()
                }) === -1) {

                pendingOnEndDateWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
            // since this task plan was not already add we would have to see if addition of this task plan would cause new release/releaseplan against this warning
            var releaseAlreadyAdded = false
                if (pendingOnEndDateWarning.releases) {
                    releaseAlreadyAdded = pendingOnEndDateWarning.releases.filter(r => {
                    return r._id.toString() == taskPlan.release._id.toString()
                }).length > 0
            }

                if (!pendingOnEndDateWarning.releases || pendingOnEndDateWarning.releases.findIndex(r => {
                        return r._id.toString() === taskPlan.release._id.toString()
                    }) === -1) {
                    pendingOnEndDateWarning.releases.push(Object.assign({}, release.toObject(), {source: true}))
            }

                if (!pendingOnEndDateWarning.releasePlans || pendingOnEndDateWarning.releasePlans.findIndex(r => {
                        return r._id.toString() === taskPlan.releasePlan._id.toString()
                    }) === -1) {
                    pendingOnEndDateWarning.releasePlans.push(Object.assign({}, release.toObject(), {source: true}))
            }
            }
            return await pendingOnEndDateWarning.save()
    } else {
            pendingOnEndDateWarning = {}
            pendingOnEndDateWarning.type = SC.WARNING_PENDING_ON_END_DATE

        let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
        logger.debug('taskReportedAsPendingOnEndDate(): ', {release})
            pendingOnEndDateWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
        logger.debug('taskReportedAsPendingOnEndDate(): ', {releasePlan})
            pendingOnEndDateWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
                source: true, employee: {
                _id:taskPlan.employee._id
                }
            })]
            pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
                source: true
            })]
            logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
            return await WarningModel.create(pendingOnEndDateWarning)
        }
    }

    return undefined
}

/**
 * Task reported as completed see what warning changes can be made
 * @param taskPlan
 * @returns {Promise.<void>}
 */
warningSchema.statics.taskReportedAsCompleted = async (taskPlan, beforeEndDate) => {

    logger.debug('taskReportedAsCompleted(): ', {taskPlan}, {beforeEndDate})

    /**
     * See if there is warning with type pending on reported date against release plan of this task plan against employee, remove that warning
     */

    let pendingOnEndDateWarning = await WarningModel.remove({
        type: SC.WARNING_PENDING_ON_END_DATE,
        'releasePlans._id': mongoose.Types.ObjectId(taskPlan.releasePlan._id)
    })

    logger.debug('taskReportedAsCompleted(): ', {pendingOnEndDateWarning})
    if (beforeEndDate) {
        // Task is reported as completed before end date, we need to raise that warning so that manager can plan other tasks on saved days

        /**
         * As a release plan can only be completed once we can safely assume that there will be no such warning present and hence can directly create one.
         * We are here trusting our code that it will not allow multiple completions and would also remove any such warning if task is marked pending again
         */

        let completeBeforeWarning = {}
        completeBeforeWarning.type = SC.WARNING_COMPLETED_BEFORE_END_DATE

        let release = await MDL.ReleaseModel.findById(taskPlan.release._id, {name: 1, project: 1})
        logger.debug('taskReportedAsCompleted(): ', {release})
        completeBeforeWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, {task: 1})
        logger.debug('taskReportedAsCompleted(): ', {releasePlan})
        completeBeforeWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        completeBeforeWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
        logger.debug('taskReportedAsCompleted():  creating warning ', {warning: completeBeforeWarning})
        return await WarningModel.create(completeBeforeWarning)
    }

    return undefined
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
    // let taskPlans = []
    //let releasePlans = []
    //let releases = []
    //let planningDate = new Date("2018-06-05")
    new Promise((resolve, reject) => {
        return resolve(false)
    })

}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
