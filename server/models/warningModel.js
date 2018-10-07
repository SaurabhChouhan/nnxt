import mongoose from 'mongoose'
import logger from '../logger'
import _ from 'lodash'
import AppError from '../AppError'
import * as MDL from '../models'
import * as SC from '../serverconstants'
import * as U from '../utils'
import * as EC from '../errorcodes'
import moment from 'moment'

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
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String}
    },
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
    leave: {
        _id: mongoose.Schema.ObjectId
    },
    raisedOn: {type: Date, default: Date.now()},
    mute: {type: Boolean, default: false}
}, {
    usePushEach: true
})

const copyWarnings = (source, target) => {
    if (!source || !target || !Array.isArray(target.added) || !Array.isArray(target.removed))
        return
    if (source.added && source.added.length)
        target.added.push(...source.added)
    if (source.removed && source.removed.length)
        target.removed.push(...source.removed)

}

const deleteLessPlannedHours = async (releasePlan) => {
    let warningResponse = {
        added: [],
        removed: []
    }
    // less planned hours warning if present would be removed
    let lessPlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_LESS_PLANNED_HOURS,
        "releasePlans._id": releasePlan._id
    })

    if (lessPlannedHoursWarning) {
        warningResponse.removed.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_LESS_PLANNED_HOURS
        })

        await lessPlannedHoursWarning.remove()
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
        if (morePlannedHoursWarning) {
            warningResponse.removed.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_MORE_PLANNED_HOURS
            })

            await morePlannedHoursWarning.remove()
        }
    }

    return warningResponse
}

const addMorePlannedHours = async (releasePlan, release) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    let morePlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_MORE_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
    // check to see if there is already a more planned hours warning
    if (!morePlannedHoursWarning) {
        let newMorePlannedHoursWarning = new WarningModel()
        newMorePlannedHoursWarning.type = SC.WARNING_MORE_PLANNED_HOURS
        newMorePlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newMorePlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_MORE_PLANNED_HOURS,
            source: true
        })
        await newMorePlannedHoursWarning.save()
    }

    return warningResponse
}

const addLessPlannedHours = async (releasePlan, release) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    let lessPlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_LESS_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
    // check to see if there is already a more planned hours warning
    if (!lessPlannedHoursWarning) {
        let newLessPlannedHoursWarning = new WarningModel()
        newLessPlannedHoursWarning.type = SC.WARNING_LESS_PLANNED_HOURS
        newLessPlannedHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        newLessPlannedHoursWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_LESS_PLANNED_HOURS,
            source: true
        })
        await newLessPlannedHoursWarning.save()
    }

    return warningResponse
}


/*-------------------------------------------------------------------GET_WARNINGS_SECTION_START---------------------------------------------------------------------*/
warningSchema.statics.getWarnings = async (releaseID, warningType, user) => {
    //
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID))
    if (!release) {
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    // Get all roles user have in this release
    let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(release._id, user)
    if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER], userRolesInThisRelease)) {
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can see warnings of any release', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let filter = []
    filter = {'releases._id': releaseID}
    if (warningType && warningType.toLowerCase() !== SC.ALL)
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
    })]
    warning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
        source: true
    })]
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
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}

/*-------------------------------------------------------------------REMOVED_UNPLANNED_SECTION_END-----------------------------------------------------------------*/


/*-------------------------------------------------------------------TASK_REPORTED_SECTION_START----------------------------------------------------------*/


const updateMoreReportedHours = async (releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    /*
       Only one more reported hours warning can be associated with a release plan so if reported hour 3  warning is
       associated with release plan than no other warning (1,2,4) can be there
     */

    // Check to see if there is already any more reported warnings

    let moreReportedWarnings = await WarningModel.findOne({
        $and: [{
            $or: [{type: SC.WARNING_MORE_REPORTED_HOURS_1},
                {type: SC.WARNING_MORE_REPORTED_HOURS_2},
                {type: SC.WARNING_MORE_REPORTED_HOURS_3},
                {type: SC.WARNING_MORE_REPORTED_HOURS_4}]
        },
            {'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)}]
    })

    logger.debug("updateMoreReportedHours(): ", {moreReportedWarnings})

    let addedType = undefined
    let removedType = undefined

    if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 4)) {
        // More reported waning would be added if not already added
        if (moreReportedWarnings && moreReportedWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_4) {
            // As previous warning does not have reported 4 warning so that warning would be removed
            removedType = moreReportedWarnings.type
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_4
    } else if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 2)) {
        // Need to add WARNING_MORE_REPORTED_HOURS_3
        if (moreReportedWarnings && moreReportedWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_3) {
            removedType = moreReportedWarnings.type;
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_3
    } else if (releasePlan.report.reportedHours > (releasePlan.task.estimatedHours * 1.5)) {
        // Need to add WARNING_MORE_REPORTED_HOURS_2
        if (moreReportedWarnings && moreReportedWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_2) {
            removedType = moreReportedWarnings.type;
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_2
    }
    else if (releasePlan.report.reportedHours > releasePlan.task.estimatedHours) {
        // Need to add WARNING_MORE_REPORTED_HOURS_1
        if (moreReportedWarnings && moreReportedWarnings.type != SC.WARNING_MORE_REPORTED_HOURS_1) {
            removedType = moreReportedWarnings.type
        }
        addedType = SC.WARNING_MORE_REPORTED_HOURS_1
    }
    else {
        // No reported warning would be raised, remove if already present
        if (moreReportedWarnings)
            removedType = moreReportedWarnings.type;
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

    if (moreReportedWarnings) {
        // warningResponse.removed.push(releasePlanWarnings)
        if (addedType) {
            moreReportedWarnings.type = addedType
            await moreReportedWarnings.save()
        } else {
            // Need to remove warning as reported hour updated (reportedHour<estimatedHour)
            await await WarningModel.findByIdAndRemove(mongoose.Types.ObjectId(moreReportedWarnings._id))
        }
    } else {
        let moreHoursWarning = new WarningModel()
        if (addedType) {
            moreHoursWarning.type = addedType
            //moreHoursWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: false})]
            moreHoursWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            moreHoursWarning.releases = [Object.assign({}, release.toObject(), {source: false})]
            //  newTooManyHoursWarning.employeeDays = [...employeeDays]
            await moreHoursWarning.save()
        }
    }

    return warningResponse
}

/**
 * Task reported as completed see what warning changes can be made
 *
 */
const taskReportedAsCompleted = async (taskPlan, releasePlan, beforeEndDate) => {
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

        let completeBeforeWarning = new WarningModel()
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
        completeBeforeWarning.employee = taskPlan.employee
        // save
        await completeBeforeWarning.save()

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
 * Task reported as pending on end date, see what warning changes can be made
 * @param taskPlan
 * @returns {Promise.<*>}
 */

const taskReportedAsPendingOnEndDate = async (taskPlan, finalStatusFromCompleteToPending) => {
    //logger.debug('taskReportedAsPendingOnEndDate(): taskplan ', {taskPlan})

    let warningResponse = {
        added: [],
        removed: []
    }


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
        pendingOnEndDateWarning = new WarningModel()
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

        if (finalStatusFromCompleteToPending) {
            // in this particular case there can be other pending reported tasks on same date that don't have this warning yet so need to push it
            let taskPlans = await MDL.TaskPlanningModel.find({
                'employee._id': taskPlan.employee._id,
                'releasePlan._id': releasePlan._id,
                'planningDate': U.dateInUTC(taskPlan.planningDateString),
                'report.status': SC.STATUS_PENDING
            }).lean()

            logger.debug("taskReopenedPendingOnEndDate(): ", {taskPlans})

            if (taskPlans && taskPlans.length) {
                taskPlans.push(Object.assign({}, taskPlan.toObject(), {
                    source: true
                }))
                pendingOnEndDateWarning.taskPlans = taskPlans
            } else {
                pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
                    source: true
                })]
            }
        } else {
            pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
                source: true
            })]
        }

        pendingOnEndDateWarning.employee = taskPlan.employee
        //logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
        await pendingOnEndDateWarning.save()

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

        pendingOnEndDateWarning.taskPlans.forEach(t => {
            warningResponse.added.push({
                _id: t._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                source: true,
                type: SC.WARNING_PENDING_ON_END_DATE
            })
        })

    }

    return warningResponse
}

const deleteCompletedBeforeEndDate = async (taskPlan, releasePlan) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    // find complete before warning

    let completedBeforeEndDateWarning = await WarningModel.findOne({
        type: SC.WARNING_COMPLETED_BEFORE_END_DATE,
        'releasePlans': {
            '$elemMatch': {
                _id: mongoose.Types.ObjectId(taskPlan.releasePlan._id),
                'employee._id': mongoose.Types.ObjectId(taskPlan.employee._id)
            }
        }
    })

    if (completedBeforeEndDateWarning) {
        await completedBeforeEndDateWarning.remove()
        completedBeforeEndDateWarning.taskPlans.forEach(tp => {
            if (tp) {
                warningResponse.removed.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_COMPLETED_BEFORE_END_DATE
                })
            }
        })
        // Warning from release plan would only be removed if there is no other such warning on this release plan due to other employee
        let count = await WarningModel.count({
            'releasePlans._id': releasePlan._id,
            type: SC.WARNING_COMPLETED_BEFORE_END_DATE
        })

        if (count == 0) {
            warningResponse.removed.push({
                _id: releasePlan._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_COMPLETED_BEFORE_END_DATE
            })
        }
    }
    return warningResponse
}


/**
 * Called when any task is reported
 */
warningSchema.statics.taskReported = async (taskPlan, releasePlan, release, extra) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    const {reportedMoment, employeePlanningIdx, reportInput, finalStatusFromCompleteToPending, finalStatusStillCompleted} = extra

    // Removed unreported flag

    let unreportedWarning = await removeUnreported(taskPlan)

    copyWarnings(unreportedWarning, warningResponse)
    let generatedWarningsMoreReportedHours = await updateMoreReportedHours(releasePlan, release)

    copyWarnings(generatedWarningsMoreReportedHours, warningResponse)


    /**
     * Check if employee has reported task on last date of planning against this employee
     */

    if (reportInput.status === SC.REPORT_PENDING) {
        if (reportedMoment.isSame(releasePlan.planning.employees[employeePlanningIdx].maxPlanningDate) && !finalStatusStillCompleted) {
            // Add appropriate warnings
            let warningsReportedAsPending = await taskReportedAsPendingOnEndDate(taskPlan, finalStatusFromCompleteToPending)
            logger.debug('addTaskReport(): taskReportedAsPending ', {warningsReportedAsPending})
            // Iterate through warnings and see what flags needs to be added to which task plans/release plans/releases
            copyWarnings(warningsReportedAsPending, warningResponse)
        } else if (finalStatusFromCompleteToPending) {
            // reported moment is before max planning date and final status was completed and now it is changed to pending
            let warningDeleteCompletedBeforeEndDate = await deleteCompletedBeforeEndDate(taskPlan, releasePlan)
            copyWarnings(warningDeleteCompletedBeforeEndDate, warningResponse)
        }
    }

    // Task is reported as completed this can make changes to existing warnings/flags like pending on end date
    if (reportInput.status === SC.REPORT_COMPLETED) {
        let warningReportedAsCompleted = undefined
        if (reportedMoment.isSame(releasePlan.planning.employees[employeePlanningIdx].maxPlanningDate)) {
            warningReportedAsCompleted = await taskReportedAsCompleted(taskPlan, releasePlan, false)
        }
        else {
            warningReportedAsCompleted = await taskReportedAsCompleted(taskPlan, releasePlan, true)
        }

        logger.debug("taskReported(): ", {warningReportedAsCompleted})

        /*
        if (warningReportedAsCompleted.added && warningReportedAsCompleted.added.length)
            warningResponse.added.push(...warningReportedAsCompleted.added)
        if (warningReportedAsCompleted.removed && warningReportedAsCompleted.removed.length)
            warningResponse.removed.push(...warningReportedAsCompleted.removed)
            */

        copyWarnings(warningReportedAsCompleted, warningResponse)
        logger.debug("taskReported(): ", {warningResponse})

    }
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
    let releasePlanRemovalPromises = warning.releasePlans.map(rp => {
        /*
          Although warning may be removed from a particular date of release plan but it is possible
          that warning still exists on other dates of same release plan , we have to therefore check to see if warning
          is present for this release plan on any other date, if not we can safely remove flag from release plan
        */

        return WarningModel.count({
            type: warningType,
            'releasePlans._id': rp._id
        }).then(releaseWarningCount => {
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
    })
    await Promise.all(releasePlanRemovalPromises)

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
        newTooManyHoursWarning.employee = taskPlan.employee
        await newTooManyHoursWarning.save()
    }
    return warningResponse
}

const updateEmployeeAskForLeaveOnTaskAdd = async (taskPlan, releasePlan, release, employee, momentPlanningDate) => {
    let warningResponse = {
        added: [],
        removed: []
    }


    // Maximum one leave is possible on a particular date for an employee find if there is any such leave

    let leave = await MDL.LeaveModel.findOne({
        'user._id': mongoose.Types.ObjectId(employee._id),
        'startDate': {$lte: momentPlanningDate.toDate()},
        'endDate': {$gte: momentPlanningDate.toDate()},
        'status': SC.LEAVE_STATUS_RAISED
    })

    logger.debug("updateEmployeeAskForLeaveOnAddTaskPlan(): ", {leave})

    if (leave) {
        // Find warning associated with this leave if any

        let employeeAskForLeaveWarning = await WarningModel.findOne({
            "leave._id": leave._id
        })

        logger.debug("updateEmployeeAskForLeaveOnAddTaskPlan(): found ", {employeeAskForLeaveWarning})

        if (employeeAskForLeaveWarning) {
            // Add this task plan to existing list of task plans
            employeeAskForLeaveWarning.taskPlans = [...employeeAskForLeaveWarning.taskPlans, Object.assign({}, taskPlan.toObject(), {source: true})]
            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })

            // This release plan may already be there, if not add this release plan as well
            if (employeeAskForLeaveWarning.releasePlans && employeeAskForLeaveWarning.releasePlans.length && employeeAskForLeaveWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) === -1) {
                employeeAskForLeaveWarning.releasePlans = [...employeeAskForLeaveWarning.releasePlans, Object.assign({}, releasePlan.toObject(), {source: true})]
                warningResponse.added.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            }

            // Add release to existing list of releases if release is not already added
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

            // Create a new warning
            employeeAskForLeaveWarning = new WarningModel()
            employeeAskForLeaveWarning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            employeeAskForLeaveWarning.leave = leave
            employeeAskForLeaveWarning.employee = {
                _id: employee._id,
                name: U.getFullName(employee)
            }
            employeeAskForLeaveWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            employeeAskForLeaveWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            employeeAskForLeaveWarning.releases = [Object.assign({}, release.toObject(), {source: true})]

            logger.debug("updateEmployeeAskForLeaveOnAddTaskPlan(): NEW ", {employeeAskForLeaveWarning})

            logger.debug("updateEmployeeAskForLeaveOnAddTaskPlan(): ", {releasePlan})

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
            await employeeAskForLeaveWarning.save()
        }
    }

    return warningResponse
}

const updateEmployeeOnLeaveOnTaskAdd = async (taskPlan, releasePlan, release, employee, momentPlanningDate) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    // Maximum one leave is possible on a particular date for an employee find if there is any such leave

    let leave = await MDL.LeaveModel.findOne({
        'user._id': mongoose.Types.ObjectId(employee._id),
        'startDate': {$lte: momentPlanningDate.toDate()},
        'endDate': {$gte: momentPlanningDate.toDate()},
        'status': SC.LEAVE_STATUS_APPROVED
    })

    logger.debug("updateEmployeeOnLeaveOnTaskAdd(): ", {leave})

    if (leave) {
        // Find warning associated with this leave if any

        let employeeOnLeaveWarning = await WarningModel.findOne({
            "leave._id": leave._id
        })

        logger.debug("updateEmployeeOnLeaveOnTaskAdd(): found ", {employeeAskForLeaveWarning: employeeOnLeaveWarning})

        if (employeeOnLeaveWarning) {
            // Add this task plan to existing list of task plans
            employeeOnLeaveWarning.taskPlans = [...employeeOnLeaveWarning.taskPlans, Object.assign({}, taskPlan.toObject(), {source: true})]
            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })

            // This release plan may already be there, if not add this release plan as well
            if (employeeOnLeaveWarning.releasePlans && employeeOnLeaveWarning.releasePlans.length && employeeOnLeaveWarning.releasePlans.findIndex(rp => rp._id.toString() === releasePlan._id.toString()) === -1) {
                employeeOnLeaveWarning.releasePlans = [...employeeOnLeaveWarning.releasePlans, Object.assign({}, releasePlan.toObject(), {source: true})]
                warningResponse.added.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }

            // Add release to existing list of releases if release is not already added
            if (employeeOnLeaveWarning.releases && employeeOnLeaveWarning.releases.length && employeeOnLeaveWarning.releases.findIndex(r => r._id.toString() === release._id.toString()) === -1) {
                employeeOnLeaveWarning.releases = [...employeeOnLeaveWarning.releases, Object.assign({}, release.toObject(), {source: true})]
                warningResponse.added.push({
                    _id: release._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                    source: true
                })
            }

            await employeeOnLeaveWarning.save()
        } else {

            // Create a new warning
            employeeOnLeaveWarning = new WarningModel()
            employeeOnLeaveWarning.type = SC.WARNING_EMPLOYEE_ON_LEAVE
            employeeOnLeaveWarning.leave = leave
            employeeOnLeaveWarning.employee = {
                _id: employee._id,
                name: U.getFullName(employee)
            }
            employeeOnLeaveWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {source: true})]
            employeeOnLeaveWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
            employeeOnLeaveWarning.releases = [Object.assign({}, release.toObject(), {source: true})]

            logger.debug("updateEmployeeOnLeaveOnTaskAdd(): NEW ", {employeeAskForLeaveWarning: employeeOnLeaveWarning})

            logger.debug("updateEmployeeOnLeaveOnTaskAdd(): ", {releasePlan})

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
            await employeeOnLeaveWarning.save()
        }
    }

    return warningResponse
}

/**
 * Handles code related to add less planned hours warning
 */
const addLessPlannedHoursOnTaskAdd = async (taskPlan, releasePlan, release) => {

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

const addMorePlannedHoursOnTaskAdd = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    let morePlannedHoursWarning = await WarningModel.findOne({
        type: SC.WARNING_MORE_PLANNED_HOURS,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    if (morePlannedHoursWarning) {
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


/**
 * Called when any task is planned
 */
warningSchema.statics.taskAdded = async (taskPlan, releasePlan, release, employee, plannedHourNumber, momentPlanningDate, firstTaskOfReleasePlan, addedAfterMaxDate) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    // See if this addition of planning causes too many hours warning
    // Check if planned hours crossed limit of maximum hours as per configuration, if yes generate too many hours warning
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let employeeDay = await MDL.EmployeeDaysModel.findOne({
        'date': momentPlanningDate,
        'employee._id': mongoose.Types.ObjectId(employee._id)
    })

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


    // UNREPORTED WARNING FOR TASKS ADDED IN PAST
    let plannedMomentIndia = U.momentInTimeZone(taskPlan.planningDateString, SC.INDIAN_TIMEZONE)
    plannedMomentIndia.add(1, 'days')

    // In case this task is planned in past we would add unreported warning
    if (plannedMomentIndia.isBefore(new Date())) {
        let unreportedWarning = await WarningModel.addUnreported(taskPlan)
        logger.debug("WarningModel.taskAdded(): ", {unreportedWarning})
        copyWarnings(unreportedWarning, warningResponse)
    }

    //let unreportedWarnings = await WarningModel.addUnreported()

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
    }

    //EMPLOYEE ASK FOR LEAVE UPDATE
    let warningsAskForLeave = await updateEmployeeAskForLeaveOnTaskAdd(taskPlan, releasePlan, release, employee, momentPlanningDate)

    logger.debug("updateEmployeeAskForLeaveOnAddTaskPlan(): ", {warningsAskForLeave})

    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)
    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)

    //EMPLOYEE ON LEAVE UPDATE
    let warningsOnLeave = await updateEmployeeOnLeaveOnTaskAdd(taskPlan, releasePlan, release, employee, momentPlanningDate)

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)
    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)

    //LESS PLANNED HOURS OR MORE PLANNED HOURS OR NO WARNING AT ALL

    if (releasePlan.planning.plannedHours < releasePlan.task.estimatedHours) {
        /*Add less planned hours warning*/
        logger.debug('WarningModel.taskAdded(): planned hours are less than actual estimated hours so need to raise warning')

        let warningsLessPlannedHours = await addLessPlannedHoursOnTaskAdd(taskPlan, releasePlan, release)

        if (warningsLessPlannedHours.added && warningsLessPlannedHours.added.length)
            warningResponse.added.push(...warningsLessPlannedHours.added)
        if (warningsLessPlannedHours.removed && warningsLessPlannedHours.removed.length)
            warningResponse.removed.push(...warningsLessPlannedHours.removed)

    } else if (releasePlan.planning.plannedHours > releasePlan.task.estimatedHours) {
        /*Add more planned hours warning*/
        logger.debug('WarningModel.taskAdded(): planned hours are more than actual estimated hours so need to raise warning')

        let warningsMorePlannedHours = await addMorePlannedHoursOnTaskAdd(taskPlan, releasePlan, release)
        if (warningsMorePlannedHours.added && warningsMorePlannedHours.added.length)
            warningResponse.added.push(...warningsMorePlannedHours.added)
        if (warningsMorePlannedHours.removed && warningsMorePlannedHours.removed.length)
            warningResponse.removed.push(...warningsMorePlannedHours.removed)
    } else {
        /*delete more planned hours warning and less planned hours warning*/
        logger.debug('WarningModel.taskAdded(): planned hours are equal to estimated hours so no need to raise warning delete all less planned hours and more planned hours warning')
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
const updateTooManyHoursOnTaskPlanDeleted = async (taskPlan, releasePlan, release, plannedDateUTC) => {

    logger.debug("WarningModel->deleteTooManyHours() called")

    /**
     * It is possible that this warning is added earlier as well like when task plan is added with more than maximum planning hour to same developer at same date
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
            let deleteWarningResponse = await deleteWarningWithResponse(tooManyHourWarning, SC.WARNING_TOO_MANY_HOURS)
            if (deleteWarningResponse.added && deleteWarningResponse.added.length)
                warningResponse.added.push(...deleteWarningResponse.added)
            if (deleteWarningResponse.removed && deleteWarningResponse.removed.length)
                warningResponse.removed.push(...deleteWarningResponse.removed)

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

const updateEmployeeAskForLeaveOnTaskDelete = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // Find out ask for leave warning associated with task plan (if any), task plan should only be associated with one leave warning
    // as task plan is specific to one employee/one date and only one leave is possible for one employee one date

    let employeeAskForLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
        'taskPlans._id': taskPlan._id
    })

    logger.debug("updateEmployeeAskForLeaveOnDeleteTaskPlan(): ", {employeeAskForLeaveWarning})

    if (employeeAskForLeaveWarning) {
        // Warning found, we need to remove this task plan from this warning and see what other changes would be made

        employeeAskForLeaveWarning.taskPlans = employeeAskForLeaveWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())

        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
            source: true
        })

        if (employeeAskForLeaveWarning.taskPlans && employeeAskForLeaveWarning.taskPlans.length > 0) {
            // There are still task plans remaining in warning, so warning would not be removed
            // Since a task plan is removed we need to see if this is last task plan of this release plan in this release

            if (employeeAskForLeaveWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) === -1) {
                // No task plan remains for this release so remove release plan from warning as well
                employeeAskForLeaveWarning.releasePlans = employeeAskForLeaveWarning.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())

                // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan
                let count = await WarningModel.count({
                    'releasePlans._id': releasePlan._id,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                })

                logger.debug("updateEmployeeAskForLeaveOnDeleteTaskPlan(): ", {count})

                if (count == 1) {
                    // only one employee on leave warning found for this release plan which is the warning we are process
                    // since all task plans of this release plan is now removed from leave warning we can mark this release plan as removed
                    warningResponse.removed.push({
                        _id: releasePlan._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                    })
                }

            }

            // Check to see if release would also be removed from warning due to task plan removal
            if (employeeAskForLeaveWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) === -1) {
                employeeAskForLeaveWarning.releases = employeeAskForLeaveWarning.releases.filter(r => r._id.toString() !== release._id.toString())
            }
            await employeeAskForLeaveWarning.save()

        } else {
            // No task plan remaining after removal of this task plan so remove warning
            employeeAskForLeaveWarning.taskPlans.forEach(tp => {
                if (tp) {
                    warningResponse.removed.push({
                        _id: tp._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                        source: tp.source
                    })
                }
            })

            // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan
            let count = await WarningModel.count({
                'releasePlans._id': releasePlan._id,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            })

            logger.debug("updateEmployeeAskForLeaveOnDeleteTaskPlan(): ", {count})

            if (count == 1) {
                // only one employee on leave warning found for this release plan which is the warning we are process
                // since all task plans of this release plan is now removed from leave warning we can mark this release plan as removed
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                })
            }

            await employeeAskForLeaveWarning.remove()
        }
    }
    return warningResponse
}


const updateEmployeeOnLeaveOnTaskDelete = async (taskPlan, releasePlan, release) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // Find out ask for leave warning associated with task plan (if any), task plan should only be associated with one leave warning
    // as task plan is specific to one employee/one date and only one leave is possible for one employee one date

    let employeeOnLeaveWarning = await WarningModel.findOne({
        type: SC.WARNING_EMPLOYEE_ON_LEAVE,
        'taskPlans._id': taskPlan._id
    })

    logger.debug("updateEmployeeAskForLeaveOnDeleteTaskPlan(): ", {employeeAskForLeaveWarning: employeeOnLeaveWarning})

    if (employeeOnLeaveWarning) {
        // Warning found, we need to remove this task plan from this warning and see what other changes would be made

        employeeOnLeaveWarning.taskPlans = employeeOnLeaveWarning.taskPlans.filter(tp => tp._id.toString() !== taskPlan._id.toString())

        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_EMPLOYEE_ON_LEAVE
        })

        if (employeeOnLeaveWarning.taskPlans && employeeOnLeaveWarning.taskPlans.length > 0) {
            // There are still task plans remaining in warning, so warning would not be removed
            // Since a task plan is removed we need to see if this is last task plan of this release plan in this release

            if (employeeOnLeaveWarning.taskPlans.findIndex(tp => tp.releasePlan._id.toString() === releasePlan._id.toString()) === -1) {
                // No task plan remains for this release so it is possible that this release plan is removed from warning as well
                employeeOnLeaveWarning.releasePlans = employeeOnLeaveWarning.releasePlans.filter(rp => rp._id.toString() !== releasePlan._id.toString())


                // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan
                let count = await WarningModel.count({
                    'releasePlans._id': releasePlan._id,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })

                if (count == 1) {
                    // only one employee on leave warning found for this release plan which is the warning we are process
                    // since all task plans of this release plan is now removed from leave warning we can mark this release plan as removed
                    warningResponse.removed.push({
                        _id: releasePlan._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_EMPLOYEE_ON_LEAVE
                    })
                }
            }

            // Check to see if release would also be removed from warning due to task plan removal
            if (employeeOnLeaveWarning.taskPlans.findIndex(tp => tp.release._id.toString() === release._id.toString()) === -1) {
                employeeOnLeaveWarning.releases = employeeOnLeaveWarning.releases.filter(r => r._id.toString() !== release._id.toString())
            }

            await employeeOnLeaveWarning.save()

        } else {
            // No task plan remaining after removal of this task plan so remove warning
            employeeOnLeaveWarning.taskPlans.forEach(tp => {
                if (tp) {
                    warningResponse.removed.push({
                        _id: tp._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_EMPLOYEE_ON_LEAVE
                    })
                }
            })


            // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan

            let count = await WarningModel.count({
                'releasePlans._id': releasePlan._id,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE
            })

            if (count == 1) {
                // only one employee on leave warning found for this release plan which is the warning we are process
                // since all task plans of this release plan is now removed from leave warning we can mark this release plan as removed
                warningResponse.removed.push({
                    _id: releasePlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })
            }

            await employeeOnLeaveWarning.remove()
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

    // Remove unreported warning as task is now deleted
    let unreportedWarning = await removeUnreported(taskPlan)
    copyWarnings(unreportedWarning, warningResponse)

    //TOO MANY HOURS UPDATE
    let warningsTooManyHours = await updateTooManyHoursOnTaskPlanDeleted(taskPlan, releasePlan, release, plannedDateUTC)
    copyWarnings(warningsTooManyHours, warningResponse)
    logger.debug('[task-plan-deleted-warning]: [warningsTooManyHours] =>', {warningsTooManyHours})

    //EMPLOYEE ASK FOR LEAVE UPDATE
    let warningsAskForLeave = await updateEmployeeAskForLeaveOnTaskDelete(taskPlan, releasePlan, release)
    logger.debug('[task-plan-deleted-warning]: ', {warningsAskForLeave})
    copyWarnings(warningsAskForLeave, warningResponse)

    //EMPLOYEE ON LEAVE UPDATE
    let warningsOnLeave = await updateEmployeeOnLeaveOnTaskDelete(taskPlan, releasePlan, release)
    copyWarnings(warningsOnLeave, warningResponse)
    logger.debug('[task-plan-deleted-warning]: [Employee-On-Leave] warning response ', {warningsOnLeave})

    //LESS PLANNED HOURS OR MORE PLANNED HOURS OR NO WARNING AT ALL
    let warningsLessPlannedHours, warningsMorePlannedHours;
    if (releasePlan.planning.plannedHours === 0) {
        /*Only unplanned warning will be there if task plans are not available*/
        logger.debug('[task-plan-deleted-warning]: planned hours are zero delete all warning')
        warningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)
        warningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)

    } else if (releasePlan.planning.plannedHours < releasePlan.task.estimatedHours) {
        // Since task plan is deleted and planned hours are reduced below estimated hours
        // or they might already be less than estimated hours, in both case we would have to check
        // if a less planned hours warning needs to be raised or updated

        logger.debug('[task-plan-deleted-warning]: planned hours are less than actual estimated hours so need to raise warning')
        warningsLessPlannedHours = await addLessPlannedHoursOnDeleteTaskPlan(taskPlan, releasePlan, release)
    } else if (releasePlan.planning.plannedHours > releasePlan.task.estimatedHours) {
        /*Add more planned hours warning*/
        logger.debug('[task-plan-deleted-warning]: planned hours are more than actual estimated hours so need to raise warning more planned hours')
        warningsMorePlannedHours = await addMorePlannedHoursOnDeleteTaskPlan(taskPlan, releasePlan, release)
    } else {
        logger.debug('[task-plan-deleted-warning]: Exceptional condition need to delete all warnings')
        warningsMorePlannedHours = await deleteMorePlannedHours(releasePlan)
        warningsLessPlannedHours = await deleteLessPlannedHours(releasePlan)
    }

    copyWarnings(warningsMorePlannedHours, warningResponse)
    copyWarnings(warningsLessPlannedHours, warningResponse)

    // COMPLETED BEFORE END DATE and PENDING ON END DATE

    let employeeReportIdx = -1
    if (releasePlan.report.employees) {
        employeeReportIdx = releasePlan.report.employees.findIndex(e => {
            return e._id.toString() === taskPlan.employee._id.toString()
        })
    }

    if (employeeReportIdx != -1) {
        if (releasePlan.report.employees[employeeReportIdx].maxReportedDate) {
            logger.debug("taskPlanDeleted() max reported date ", releasePlan.report.employees[employeeReportIdx].maxReportedDate)
            let maxReportedMoment = moment(releasePlan.report.employees[employeeReportIdx].maxReportedDate)
            if (maxReportedMoment) {

                // PENDING ON END DATE

                /*
                    This warning should be added against all task plans of max reported date
                    when M/L has removed all the future task plans against this employee
                    after date of completion (maxreporteddate)
                 */


                // COMPLETED BEFORE END DATE
                /*
                    This warning should be removed when M/L has removed all the future task plans against this employee
                    after date of completion (maxreporteddate)
                */

                logger.debug("WarningModel.taskPlanDeleted(): completedBeforeEndDate handling. maxReportedMoment is ", {maxReportedMoment})
                let count = await MDL.TaskPlanningModel.count({
                    "releasePlan._id": releasePlan._id,
                    "employee._id": taskPlan.employee._id,
                    "planningDate": {$gt: maxReportedMoment.toDate()},
                    "_id": {$ne: taskPlan._id}
                })

                logger.debug("WarningModel.taskPlanDeleted(): completedBeforeEndDate handling ", {count})

                if (count == 0) {
                    // All future tasks of max reported date is deleted, remove completed before end date warning
                    let warningsRemoveCompletedBeforeEndDate = await deleteCompletedBeforeEndDate(taskPlan, releasePlan)
                    copyWarnings(warningsRemoveCompletedBeforeEndDate, warningResponse)
                }

                if (count == 0) {
                    let warningsPendingOnEndDate = await addPendingOnEndDateOnTaskPlanDeleted(taskPlan, releasePlan, maxReportedMoment)
                    copyWarnings(warningsPendingOnEndDate, warningResponse)
                }
            }
        }
    }


    return warningResponse

}
/*-------------------------------------------------------------------TASK_PLAN_DELETED_SECTION_END-------------------------------------------------------------------*/


/*-------------------------------------------------------------------TASK_PLAN_MOVED_SECTION_START-------------------------------------------------------------------*/


const updateTooManyHoursOnTaskShift = async (release, employeeDaysArray, maxPlannedHours) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    for (const employeeDay of employeeDaysArray) {
        /* Get existing too many hours warning for this day.

           As tasks have been shifted, this warning needs to be updated. There can still be task plans/release plans of other releases that would still be
           associated with TMH warning for the day because they are not shifted in 'shift to future/past' operation. Tasks that have moved
           on other days would be removed while tasks that may have now been shifted to this day would be added associated with this warning.
           Rather than doing all this updates it is wiser that we remove this warning and create new one.

        */

        logger.debug("warning.updateTooManyHoursOnTaskShift():", {employeeDay})

        // Get existing warning before creating new else it would be difficult later on to differentiate between both
        let tooManyHoursWarning = await WarningModel.findOne({
            type: SC.WARNING_TOO_MANY_HOURS,
            'employeeDays.date': employeeDay.date,
            'employeeDays.employee._id': mongoose.Types.ObjectId(employeeDay.employee._id)
        })


        if (employeeDay.plannedHours > maxPlannedHours) {
            logger.debug('updateTooManyHoursOnTaskShift(): planned hours crossed max planned hours')
            // find out release ids added in current task plans of same day/same employee as those would be affected by this warning

            let distinctReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
                'planningDate': employeeDay.date,
                'employee._id': mongoose.Types.ObjectId(employeeDay.employee._id)
            })

            let newReleases = await MDL.ReleaseModel.getReleasesByIDs(distinctReleaseIDs)

            for (const rel of newReleases) {
                warningResponse.added.push({
                    _id: rel._id,
                    warningType: SC.WARNING_TYPE_RELEASE,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: true
                })
            }

            let distinctReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
                'planningDate': employeeDay.date,
                'employee._id': employeeDay.employee._id
            })

            let newReleasePlans = await MDL.ReleasePlanModel.getReleasePlansByIDs(distinctReleasePlanIDs)

            for (const relPlan of newReleasePlans) {
                warningResponse.added.push({
                    _id: relPlan._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS,
                    source: false
                })
            }

            // fetch task plans as all task plans are affected by this warning and hence need to be added against this warning
            let taskPlans = await MDL.TaskPlanningModel.find({
                'planningDate': employeeDay.date,
                'employee._id': mongoose.Types.ObjectId(employeeDay.employee._id)
            })

            for (const tp of taskPlans) {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_TOO_MANY_HOURS
                })
            }

            // Create warning
            let newWarning = new WarningModel()
            newWarning.type = SC.WARNING_TOO_MANY_HOURS
            newWarning.taskPlans = [...taskPlans]
            newWarning.releasePlans = [...newReleasePlans.map(rp => rp.release._id.toString() == release._id.toString() ? Object.assign({}, rp.toObject(), {source: true}) : rp)]
            newWarning.releases = [...newReleases.map(r => r._id.toString() == release._id.toString() ? Object.assign({}, r.toObject(), {source: true}) : r)]
            newWarning.employeeDays = [employeeDay]
            logger.debug('[task-shift] WarningModel.updateTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDay.date) + '] creating new warning ', {newWarning})

            try {
                await newWarning.save()
            } catch (error) {
                console.log(error)
            }
        } else {
            // too many hours warning would not be created
        }

        logger.debug("updateTooManyHoursOnTaskShift(): ", {existingWarning: tooManyHoursWarning})
        if (tooManyHoursWarning) {
            tooManyHoursWarning.releasePlans.forEach(rp => {
                if (warningResponse.added.findIndex(wa => wa._id.toString() === rp._id.toString() && wa.warningType === SC.WARNING_TYPE_RELEASE_PLAN) === -1) {
                    logger.debug('[task-shift] WarningModel.updateTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDay.date) + '] release plan [' + rp._id.toString() + '] not part of new warning hence removing')
                    warningResponse.removed.push({
                        _id: rp._id,
                        warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: rp.source
                    })
                } else
                    logger.debug('[task-shift] WarningModel.updateTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDay.date) + '] release plan [' + rp._id.toString() + '] part of new warning hence will not remove')

            })

            tooManyHoursWarning.taskPlans.forEach(tp => {
                if (warningResponse.added.findIndex(wa => wa._id.toString() === tp._id.toString() && wa.warningType === SC.WARNING_TYPE_TASK_PLAN) === -1) {
                    logger.debug('[task-shift] WarningModel.updateTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDay.date) + '] task plan [' + tp._id.toString() + '] not part of new warning hence removing')
                    warningResponse.removed.push({
                        _id: tp._id,
                        warningType: SC.WARNING_TYPE_TASK_PLAN,
                        type: SC.WARNING_TOO_MANY_HOURS,
                        source: tp.source
                    })
                } else
                    logger.debug('[task-shift] WarningModel.updateTooManyHoursTasksMoved() [' + U.formatDateInUTC(employeeDay.date) + '] task plan [' + tp._id.toString() + '] part of new warning hence will not remove')
            })

            // remove existing warning as already create new one
            await tooManyHoursWarning.remove()
        }
    }

    return warningResponse
}

const updateEmployeeAskedForLeaveProcess = async (leaves, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    for (const leave of leaves) {

        let leaveWarning = await WarningModel.findOne({
            "leave._id": leave._id
        })


        if (leaveWarning) {
            // Leave warning found, will remove all old associations and will create new
            logger.debug("updateEmployeeAskedForLeaveProcess(): leave warning found as ", {leaveWarning})

            // Add all the task plans, release plans of this leave warning to remove list as things have changed due to shifting
            // warning for this leave would be calculated again

            leaveWarning.taskPlans.forEach(t => {
                warningResponse.removed.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            })

            leaveWarning.releasePlans.forEach(r => {
                warningResponse.removed.push({
                    _id: r._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                    source: true
                })
            })

        } else {
            // No leave warning associated with this leave, this happens when employee took leave on day when there were no task plans, new warning would be created in this case

        }


        // Find out all the task plans (shifted) for found leave so that we can create new associations
        let taskPlans = await MDL.TaskPlanningModel.find({
            $and: [
                {'planningDate': {$gte: leave.startDate}},
                {'planningDate': {$lte: leave.endDate}}
            ],
            'employee._id': mongoose.Types.ObjectId(employee._id)
        }, {
            "task.name": 1
        })


        logger.debug("updateEmployeeAskedForLeaveProcess(): [" + taskPlans.length + "] found")

        if (taskPlans.length > 0) {
            // Now affected release plan ids
            let affectedReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
                $and: [
                    {'planningDate': {$gte: leave.startDate}},
                    {'planningDate': {$lte: leave.endDate}}
                ],
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })

            logger.debug("leaveRaised(): affected release plan ids are ", {affectedReleasePlanIDs})

            let releasePlans = await MDL.ReleasePlanModel.getReleasePlansByIDs(affectedReleasePlanIDs, {
                "task.name": 1
            })

            // Now affected release ids
            let affectedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
                $and: [
                    {'planningDate': {$gte: leave.startDate}},
                    {'planningDate': {$lte: leave.endDate}}
                ],
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })

            let releases = await MDL.ReleaseModel.getReleasesByIDs(affectedReleaseIDs, {
                name: 1,
                project: 1
            })

            if (!leaveWarning) {
                // create warning if not found earlier

                leaveWarning = new WarningModel()
                leaveWarning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                leaveWarning.leave = leave
                leaveWarning.employee = employee
            }

            leaveWarning.releasePlans = releasePlans.map(rp =>
                Object.assign({}, rp.toObject(), {source: true})
            )

            leaveWarning.releases = releases.map(r =>
                Object.assign({}, r.toObject(), {source: true})
            )

            leaveWarning.taskPlans = taskPlans.map(t =>
                Object.assign({}, t.toObject(), {source: true})
            )

            await leaveWarning.save()

            taskPlans.forEach(tp => {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                })
            })

            releasePlans.forEach(tp => {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
                })
            })
        } else {

            if (leaveWarning) // No task plans on leave range so need to remove leave warning (if exists)
                await leaveWarning.remove()
        }
    }

    return warningResponse

}

const updateEmployeeAskedForLeaveOnTaskShift = async (sortedAffectedMoments, employee) => {
    /*
        Our logic to update employee asked-for-leave would be
        1) Get all the leaves take by employee in range of affected moments (as other leaves would not be changed due to shifting
        2) Iterate on each leave and execute same logic on task plans as done during leave raise as task plans are already shifted
           and hence running that logic would again add those task plan/release and release plans against leave warning
           only thing needs to be considered is creating a valid add/remove list of tp/rp/r
     */

    let minDate = sortedAffectedMoments[0]
    let maxDate = sortedAffectedMoments[sortedAffectedMoments.length - 1]
    logger.debug("updateEmployeeAskedForLeaveTasksMoved(): ", {minDate})
    logger.debug("updateEmployeeAskedForLeaveTasksMoved(): ", {maxDate})

    // All those leaves would be affected due to this shifting that have some date that overlap with this date range so find all those leaves

    let leaves = await MDL.LeaveModel.find({
        $and: [
            {"user._id": employee._id},
            {startDate: {$lte: maxDate}},
            {endDate: {$gte: minDate}},
            {status: SC.LEAVE_STATUS_RAISED}
        ]
    })

    logger.debug("updateEmployeeAskedForLeaveTasksMoved(): found [" + leaves.length + "] leaves")

    return await updateEmployeeAskedForLeaveProcess(leaves, employee)
}

const updateEmployeeOnLeaveProcess = async (leaves, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    for (const leave of leaves) {

        let leaveWarning = await WarningModel.findOne({
            "leave._id": leave._id
        })


        if (leaveWarning) {
            // Leave warning found, will remove all old associations and will create new
            logger.debug("updateEmployeeOnLeaveProcess(): leave warning found as ", {leaveWarning})

            // Add all the task plans, release plans of this leave warning to remove list as things have changed due to shifting
            // warning for this leave would be calculated again

            leaveWarning.taskPlans.forEach(t => {
                warningResponse.removed.push({
                    _id: t._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })
            })

            leaveWarning.releasePlans.forEach(r => {
                warningResponse.removed.push({
                    _id: r._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })
            })

        } else {
            // No leave warning associated with this leave, this happens when employee took leave on day when there were no task plans,
            // new warning would be created in this case (LATER IN THE CODE)
        }


        // Find out all the task plans (shifted) for found leave so that we can create new associations
        let taskPlans = await MDL.TaskPlanningModel.find({
            $and: [
                {'planningDate': {$gte: leave.startDate}},
                {'planningDate': {$lte: leave.endDate}}
            ],
            'employee._id': mongoose.Types.ObjectId(employee._id)
        }, {
            "task.name": 1
        })


        logger.debug("updateEmployeeOnLeaveProcess(): [" + taskPlans.length + "] found")

        if (taskPlans.length > 0) {
            // Now affected release plan ids
            let affectedReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
                $and: [
                    {'planningDate': {$gte: leave.startDate}},
                    {'planningDate': {$lte: leave.endDate}}
                ],
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })

            logger.debug("updateEmployeeOnLeaveProcess(): affected release plan ids are ", {affectedReleasePlanIDs})

            let releasePlans = await MDL.ReleasePlanModel.getReleasePlansByIDs(affectedReleasePlanIDs, {
                "task.name": 1
            })

            // Now affected release ids
            let affectedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
                $and: [
                    {'planningDate': {$gte: leave.startDate}},
                    {'planningDate': {$lte: leave.endDate}}
                ],
                'employee._id': mongoose.Types.ObjectId(employee._id)
            })

            let releases = await MDL.ReleaseModel.getReleasesByIDs(affectedReleaseIDs, {
                name: 1,
                project: 1
            })

            if (!leaveWarning) {
                // create warning if not found earlier
                leaveWarning = new WarningModel()
                leaveWarning.type = SC.WARNING_EMPLOYEE_ON_LEAVE
                leaveWarning.leave = leave
                leaveWarning.employee = {
                    _id: employee._id,
                    name: U.getFullName(employee)
                }
            }

            leaveWarning.releasePlans = releasePlans.map(rp =>
                Object.assign({}, rp.toObject(), {source: true})
            )

            leaveWarning.releases = releases.map(r =>
                Object.assign({}, r.toObject(), {source: true})
            )

            leaveWarning.taskPlans = taskPlans.map(t =>
                Object.assign({}, t.toObject(), {source: true})
            )

            await leaveWarning.save()

            taskPlans.forEach(tp => {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_TASK_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })
            })

            releasePlans.forEach(tp => {
                warningResponse.added.push({
                    _id: tp._id,
                    warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                    type: SC.WARNING_EMPLOYEE_ON_LEAVE
                })
            })
        } else {

            if (leaveWarning) // No task plans on leave range so need to remove leave warning (if exists)
                await leaveWarning.remove()
        }
    }

    return warningResponse

}

const updateEmployeeOnLeaveOnTaskShift = async (sortedAffectedMoments, employee) => {
    /*
        Our logic to update employee asked-for-leave would be
        1) Get all the leaves take by employee in range of affected moments (as other leaves would not be changed due to shifting
        2) Iterate on each leave and execute same logic on task plans as done during leave raise as task plans are already shifted
           and hence running that logic would again add those task plan/release and release plans against leave warning
           only thing needs to be considered is creating a valid add/remove list of tp/rp/r
     */

    let minDate = sortedAffectedMoments[0]
    let maxDate = sortedAffectedMoments[sortedAffectedMoments.length - 1]
    logger.debug("updateEmployeeOnLeaveOnTaskShift(): ", {minDate})
    logger.debug("updateEmployeeOnLeaveOnTaskShift(): ", {maxDate})

    // All those leaves would be affected due to this shifting that have some date that overlap with this date range so find all those leaves

    let leaves = await MDL.LeaveModel.find({
        $and: [
            {"user._id": employee._id},
            {startDate: {$lte: maxDate}},
            {endDate: {$gte: minDate}},
            {status: SC.LEAVE_STATUS_APPROVED}
        ]
    })

    logger.debug("updateEmployeeOnLeaveOnTaskShift(): found [" + leaves.length + "]  approved leaves")

    return await updateEmployeeOnLeaveProcess(leaves, employee)
}

warningSchema.statics.tasksShifted = async (employeeDaysArray, affectedMoments, release, employee) => {
    // Max planned hours would come handy to add too many hours warning
    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)

    let warningResponse = {
        added: [],
        removed: []
    }
    /*-------------------------------------------TOO_MANY_HOUR_WARNING_UPDATE-------------------------------------------*/
    let warningsTooManyHours = await updateTooManyHoursOnTaskShift(release, employeeDaysArray, maxPlannedHoursNumber)

    if (warningsTooManyHours.added && warningsTooManyHours.added.length)
        warningResponse.added.push(...warningsTooManyHours.added)

    if (warningsTooManyHours.removed && warningsTooManyHours.removed.length)
        warningResponse.removed.push(...warningsTooManyHours.removed)

    /*-------------------------------------------EMPLOYEE_ASK_FOR_LEAVE_WARNING_UPDATE-------------------------------------------*/
    let warningsAskForLeave = await updateEmployeeAskedForLeaveOnTaskShift(affectedMoments, employee)

    logger.debug("tasksShifted(): ", {warningsAskForLeave})

    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)

    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)

    /*-------------------------------------------EMPLOYEE_ON_LEAVE_WARNING_UPDATE-------------------------------------------*/

    let warningsOnLeave = await updateEmployeeOnLeaveOnTaskShift(affectedMoments, employee)

    logger.debug("tasksShifted(): ", {warningsOnLeave})

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)

    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)

    return warningResponse

}

/*----------------------------------------------------TASK_PLAN_MOVED_SECTION_END-------------------------------------------------------------------*/

/*
_________________________________________________MERGE TASK START___________________________________________________________
 */

const updateEmployeeAskForLeaveOnTaskMove = async (taskPlan, releasePlan, release, existingPlanedDate, rePlannedDate, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // Move is similar to deleting a task from existing date and add to new date

    /** DELETE TASK PLAN EXISTING DATE CHANGES **/

    let warningExistingDateDelete = await updateEmployeeAskForLeaveOnTaskDelete(taskPlan, releasePlan, release)
    logger.debug("updateEmployeeAskForLeaveOnTaskMove(): ", {warningExistingDateDelete})

    if (warningExistingDateDelete.added && warningExistingDateDelete.added.length)
        warningResponse.added.push(...warningExistingDateDelete.added)
    if (warningExistingDateDelete.removed && warningExistingDateDelete.removed.length)
        warningResponse.removed.push(...warningExistingDateDelete.removed)


    // Now add warnings due to task addition on new date

    let warningsReplanDateDelete = await updateEmployeeAskForLeaveOnTaskAdd(taskPlan, releasePlan, release, employee, moment(rePlannedDate))
    logger.debug("updateEmployeeAskForLeaveOnTaskMove(): ", {warningsReplanDateDelete})

    if (warningsReplanDateDelete.added && warningsReplanDateDelete.added.length)
        warningResponse.added.push(...warningsReplanDateDelete.added)
    if (warningsReplanDateDelete.removed && warningsReplanDateDelete.removed.length)
        warningResponse.removed.push(...warningsReplanDateDelete.removed)

    return warningResponse
}


const updateEmployeeOnLeaveOnTaskMove = async (taskPlan, releasePlan, release, existingPlanedDate, rePlannedDate, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // Move is similar to deleting a task from existing date and add to new date

    /** DELETE TASK PLAN EXISTING DATE CHANGES **/

    let warningExistingDateDelete = await updateEmployeeOnLeaveOnTaskDelete(taskPlan, releasePlan, release)
    logger.debug("updateEmployeeOnLeaveOnTaskDelete(): ", {warningExistingDateDelete})

    if (warningExistingDateDelete.added && warningExistingDateDelete.added.length)
        warningResponse.added.push(...warningExistingDateDelete.added)
    if (warningExistingDateDelete.removed && warningExistingDateDelete.removed.length)
        warningResponse.removed.push(...warningExistingDateDelete.removed)


    // Now add warnings due to task addition on new date

    let warningsReplanDateDelete = await updateEmployeeOnLeaveOnTaskAdd(taskPlan, releasePlan, release, employee, moment(rePlannedDate))
    logger.debug("updateEmployeeOnLeaveOnTaskAdd(): ", {warningsReplanDateDelete})

    if (warningsReplanDateDelete.added && warningsReplanDateDelete.added.length)
        warningResponse.added.push(...warningsReplanDateDelete.added)
    if (warningsReplanDateDelete.removed && warningsReplanDateDelete.removed.length)
        warningResponse.removed.push(...warningsReplanDateDelete.removed)

    return warningResponse
}

// Generate warnings when task is moved to other date
warningSchema.statics.taskMoved = async (taskPlan, releasePlan, release, extra) => {
    const {existingDateEmployeeDays, rePlannedDateEmployeeDays, selectedEmployee} = extra

    let warningResponse = {
        added: [],
        removed: []
    }

    let employeeSetting = await MDL.EmployeeSettingModel.findOne({})
    let maxPlannedHoursNumber = Number(employeeSetting.maxPlannedHours)
    let momentRePlan = U.sameMomentInUTC(rePlannedDateEmployeeDays.date)

    // Get moment in india for replanning date if

    let momentNewMovedDateIndia = U.momentInTimeZone(rePlannedDateEmployeeDays.dateString, SC.INDIAN_TIMEZONE)

    logger.debug("WarningModel.taskMoved(): moment moved in india ", {momentNewMovedDateIndia})
    // add 1 day to this to get next midnight
    momentNewMovedDateIndia.add(1, 'days')

    // If current moment if before this date unreported warning should be removed from this day task

    if (momentNewMovedDateIndia.isAfter(new Date())) {
        let unreportedWarning = await removeUnreported(taskPlan)
        copyWarnings(unreportedWarning, warningResponse)
    } else {
        // unreported warning may be added
        let unreportedWarning = await WarningModel.addUnreported(taskPlan)
        copyWarnings(unreportedWarning, warningResponse)
    }

    /*TOO_MANY_HOURS WARNING UPDATE SECTION*/

    // as task is moved there is possibility of removal of too many hours warning if not removed then also task plan will be removed from warning`s task plan list
    logger.debug("[ taskMoved ]:()=> Too many hours warning would be removed from existing date (if exists)", {existingEmployeeDays: existingDateEmployeeDays})

    let deleteTooManyHoursWarningResponse = await updateTooManyHoursOnTaskPlanDeleted(taskPlan, releasePlan, release, existingDateEmployeeDays.date)
    logger.debug("taskMoved():", {deleteTooManyHoursWarningResponse})

    warningResponse.added.push(...deleteTooManyHoursWarningResponse.added)
    warningResponse.removed.push(...deleteTooManyHoursWarningResponse.removed)


    // as task is moved to new date there is possibility of adding too many hours warning
    if (rePlannedDateEmployeeDays.plannedHours > maxPlannedHoursNumber) {
        logger.debug("[ taskMoved ]:()=> Too many hours warning would be raised for rePlanning date", {rePlannedDateEmployeeDays})

        let addTooManyHoursWarningResponse = await addTooManyHours(taskPlan, releasePlan, release, rePlannedDateEmployeeDays.employee, momentRePlan)
        logger.debug("taskMoved():", {addTooManyHoursWarningResponse})

        warningResponse.added.push(...addTooManyHoursWarningResponse.added)
        warningResponse.removed.push(...addTooManyHoursWarningResponse.removed)
    }
    /*EMPLOYEE_ASK_FOR_LEAVE WARNING UPDATE SECTION*/

    let warningsAskForLeave = await updateEmployeeAskForLeaveOnTaskMove(taskPlan, releasePlan, release, existingDateEmployeeDays.date, rePlannedDateEmployeeDays.date, selectedEmployee)
    if (warningsAskForLeave.added && warningsAskForLeave.added.length)
        warningResponse.added.push(...warningsAskForLeave.added)
    if (warningsAskForLeave.removed && warningsAskForLeave.removed.length)
        warningResponse.removed.push(...warningsAskForLeave.removed)


    /*EMPLOYEE_ON_LEAVE WARNING UPDATE SECTION*/
    let warningsOnLeave = await updateEmployeeOnLeaveOnTaskMove(taskPlan, releasePlan, release, existingDateEmployeeDays.date, rePlannedDateEmployeeDays.date, selectedEmployee)

    if (warningsOnLeave.added && warningsOnLeave.added.length)
        warningResponse.added.push(...warningsOnLeave.added)
    if (warningsOnLeave.removed && warningsOnLeave.removed.length)
        warningResponse.removed.push(...warningsOnLeave.removed)

    return warningResponse
}


/*
* |____________________________________________________________________TASK_PLAN_END____________________________________________________________________|
*/


/*
* |____________________________________________________________________LEAVE_START____________________________________________________________________|
*/

/*--------------------------------------------------------LEAVE_ADDED_SECTION----------------------------------------------------------------------*/

/**
 * Employee raised request for leave
 */
warningSchema.statics.leaveRaised = async (leave, startDate, endDate, employee) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // There will only be one warning associated with leave request
    // Since leave request is raised, new ask for leave warning would be created


    /** We would now try to find all the task plans that would be affected by this leave request**/

    let taskPlans = await MDL.TaskPlanningModel.find({
        $and: [
            {'planningDate': {$gte: startDate}},
            {'planningDate': {$lte: endDate}}
        ],
        'employee._id': mongoose.Types.ObjectId(employee._id)
    })

    logger.debug("WarningModel.leaveRaised(): [" + taskPlans.length + "] task plans found")

    if (taskPlans.length) {
        // Task plans exists on date leaves are take add warning
        let warning = new WarningModel()
        warning.type = SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
        warning.leave = leave
        warning.employee = employee

        // Now affected release plan ids
        let affectedReleasePlanIDs = await MDL.TaskPlanningModel.distinct('releasePlan._id', {
            $and: [
                {'planningDate': {$gte: startDate}},
                {'planningDate': {$lte: endDate}}
            ],
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        logger.debug("WarningModel.leaveRaised(): affected release plan ids are ", {affectedReleasePlanIDs})

        let releasePlans = await MDL.ReleasePlanModel.getReleasePlansByIDs(affectedReleasePlanIDs)

        //logger.debug("leaveRaised(): affected release plan ", {releasePlans})

        // Now affected release ids
        let affectedReleaseIDs = await MDL.TaskPlanningModel.distinct('release._id', {
            $and: [
                {'planningDate': {$gte: startDate}},
                {'planningDate': {$lte: endDate}}
            ],
            'employee._id': mongoose.Types.ObjectId(employee._id)
        })

        logger.debug("WarningModel.leaveRaised(): affected release ids ", {affectedReleaseIDs})
        let releases = await MDL.ReleaseModel.getReleasesByIDs(affectedReleaseIDs)
        //logger.debug("WarningModel.leaveRaised(): affected releases ", {releases})

        warning.releasePlans = releasePlans
        warning.releases = releases
        warning.taskPlans = taskPlans
        await warning.save()

        taskPlans.forEach(tp => {
            warningResponse.added.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            })
        })

        releasePlans.forEach(tp => {
            warningResponse.added.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            })
        })
    }

    return warningResponse
}

const leaveRevokedProcessReleasePlan = async (releasePlans, warningType, warningResponse) => {
    for (const rp of releasePlans) {
        // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan
        let count = await WarningModel.count({
            'releasePlans._id': rp._id,
            type: warningType
        })

        logger.debug("leaveRevokedProcessReleasePlan(): " + rp._id, {count})

        if (count == 0) {
            warningResponse.removed.push({
                _id: rp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: warningType
            })
        }
    }
}

/**
 * Handle warnings when leave is revoked by requester. A user can revoke leave even when it is approved.
 */

warningSchema.statics.leaveRevoked = async (leave) => {

    /**
     * Leave can be in raised or approved status based on which there can be employee ask for leave or employee on leave warning
     * Need to remove all those warnings if task is deleted
     *
     */

    let warningResponse = {
        added: [],
        removed: []
    }

    let leaveWarning = await WarningModel.findOne({
        'leave._id': leave._id
    })

    if (leaveWarning) {
        // a leave warning is found check to see its type (can be employee ask for leave or employee on leave. Do removal appropriately
        // this warning would be removed a

        leaveWarning.taskPlans.forEach(tp => {
            warningResponse.removed.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: leaveWarning.type
            })
        })

        await leaveWarning.remove() // removing so that count in next method doesn't include this warning
        await leaveRevokedProcessReleasePlan(leaveWarning.releasePlans, leaveWarning.type, warningResponse)
    }

    return warningResponse
}

const leaveApprovedProcessReleasePlan = async (releasePlans, leaveWarning, warningResponse) => {

    for (const rp of releasePlans) {
        // This flag would only be removed from release plan when there are not other employee on leave warning associated with this release plan
        let count = await WarningModel.count({
            'releasePlans._id': rp._id,
            _id: {$ne: leaveWarning._id},
            type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
        })

        logger.debug("leaveApprovedProcessReleasePlan(): " + rp._id, {count})

        if (count == 0) {
            warningResponse.removed.push({
                _id: rp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
            })
        }
    }

    return warningResponse
}

warningSchema.statics.leaveApproved = async (leave) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    logger.debug("leaveApproved(): ", {leave})

    // Find out leave warning associated with this leave (if any)

    let leaveWarning = await WarningModel.findOne({
        "leave._id": mongoose.Types.ObjectId(leave._id),
        type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE
    })

    logger.debug("leaveApproved(): ", {leaveWarning})

    if (leaveWarning) {
        // Ask for leave warning need to be removed from task plans,
        // to remove it from release plan however we would have to check if this is last ask for leave warning with this release plan

        leaveWarning.taskPlans.forEach(tp => {
            warningResponse.removed.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        })

        await leaveApprovedProcessReleasePlan(leaveWarning.releasePlans, leaveWarning, warningResponse)

        /*
        leaveWarning.releasePlans.forEach(tp => {
            warningResponse.removed.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE,
                source: true
            })
        })
        */

        leaveWarning.type = SC.WARNING_EMPLOYEE_ON_LEAVE

        // Adding employee on leave warning to same associations

        leaveWarning.taskPlans.forEach(tp => {
            warningResponse.added.push({
                _id: tp._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        })

        leaveWarning.releasePlans.forEach(rp => {
            warningResponse.added.push({
                _id: rp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_EMPLOYEE_ON_LEAVE,
                source: true
            })
        })

        await leaveWarning.save()
    } else {
        // there is no leave warning so approval would not make any warning creation
    }

    return warningResponse
}
/*
* |____________________________________________________________________LEAVE_END____________________________________________________________________|
*/

warningSchema.statics.addUnreported = async (taskPlan) => {
    // Find if unreported warning already exists against task plan

    let warningResponse = {
        added: [],
        removed: []
    }

    let unreportedWarning = await MDL.WarningModel.findOne({
        type: SC.WARNING_UNREPORTED,
        'employee._id': taskPlan.employee._id,
        'releasePlans._id': taskPlan.releasePlan._id
    })

    if (!unreportedWarning) {
        // Add warning
        unreportedWarning = new WarningModel()
        unreportedWarning.type = SC.WARNING_UNREPORTED
        unreportedWarning.employee = taskPlan.employee
        unreportedWarning.taskPlans = [taskPlan]
        let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id)
        unreportedWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {source: true})]
        let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlan.release._id), {
            name: 1,
            project: 1
        })

        unreportedWarning.releases = [Object.assign({}, release.toObject(), {source: true})]

        warningResponse.added.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_UNREPORTED,
            source: true
        })
        warningResponse.added.push({
            _id: releasePlan._id,
            warningType: SC.WARNING_TYPE_RELEASE_PLAN,
            type: SC.WARNING_UNREPORTED,
            source: true
        })

    } else {
        logger.debug("found unreported warning ", {unreportedWarning})
        // since warning already exists we just need to add task plan info if not already there
        if (unreportedWarning.taskPlans.length && unreportedWarning.taskPlans.findIndex(t => t._id.toString() == taskPlan._id.toString()) == -1) {
            unreportedWarning.taskPlans.push(Object.assign({}, taskPlan.toObject(), {source: true}))
            warningResponse.added.push({
                _id: taskPlan._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                type: SC.WARNING_UNREPORTED,
                source: true
            })
        }
    }

    await unreportedWarning.save()

    return warningResponse
}

const removeUnreported = async (taskPlan) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    logger.debug("removeUnreported(): ", {taskPlan})

    let updatedUnreportedWarning = await WarningModel.findOneAndUpdate({
        type: SC.WARNING_UNREPORTED,
        'employee._id': taskPlan.employee._id,
        'releasePlans._id': taskPlan.releasePlan._id
    }, {
        $pull: {
            taskPlans: {
                _id: taskPlan._id
            }
        }
    }, {
        new: true
    })


    if (updatedUnreportedWarning && !updatedUnreportedWarning.taskPlans.length) {
        logger.debug("removeUnreported(): ", {updatedUnreportedWarning})
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_UNREPORTED
        })

        // remove warning
        await updatedUnreportedWarning.remove()
        updatedUnreportedWarning.releasePlans.forEach(rp => {
            warningResponse.removed.push({
                _id: rp._id,
                warningType: SC.WARNING_TYPE_RELEASE_PLAN,
                type: SC.WARNING_UNREPORTED
            })
        })
    } else {
        // just remove it from task
        warningResponse.removed.push({
            _id: taskPlan._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            type: SC.WARNING_UNREPORTED
        })
    }

    return warningResponse
}

const addPendingOnEndDateOnTaskPlanDeleted = async (taskPlan, releasePlan, maxReportedMoment) => {
    let warningResponse = {
        added: [],
        removed: []
    }

    // there should not be any existing pending on end date warning as we came here due to deletion of future task which means there should be no
    // pending on end date warning


    // We will add a single pending on end date warning against this employee for all the tasks on max reported moment that are reported

    let taskPlans = await MDL.TaskPlanningModel.find({
        'employee._id': taskPlan.employee._id,
        'releasePlan._id': releasePlan._id,
        'planningDate': maxReportedMoment.toDate(),
        'report.status': SC.STATUS_PENDING
    })

    let completedCount = await MDL.TaskPlanningModel.count({
        'employee._id': taskPlan.employee._id,
        'releasePlan._id': releasePlan._id,
        'planningDate': maxReportedMoment.toDate(),
        'report.status': SC.STATUS_COMPLETED
    })

    // Only add warning if task was not reported completed by any of the task plans on max reported date
    if (taskPlans.length && completedCount == 0) {
        logger.debug("warning.addPendingOnEndDateOnTaskPlanDeleted(): ", {taskPlans})

        let pendingOnEndDateWarning = new WarningModel()
        pendingOnEndDateWarning.type = SC.WARNING_PENDING_ON_END_DATE
        pendingOnEndDateWarning.employee = taskPlan.employee

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

        pendingOnEndDateWarning.taskPlans = taskPlans.map(t => {
            return Object.assign({}, t.toObject(), {
                source: true
            })
        })

        //logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
        await pendingOnEndDateWarning.save()

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

        taskPlans.forEach(t => {
            warningResponse.added.push({
                _id: t._id,
                warningType: SC.WARNING_TYPE_TASK_PLAN,
                source: true,
                type: SC.WARNING_PENDING_ON_END_DATE
            })
        })
    }

    return warningResponse

}

const taskReopenedPendingOnEndDate = async (taskPlan, releasePlan) => {

    let warningResponse = {
        added: [],
        removed: []
    }

    // Task is reopened on end date need to add pending on end date
    /**
     * As task is reopened there should not be any existing pending on end date warning
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

    if (pendingOnEndDateWarning)
        throw new AppError('No pending on end date warning should be present ', EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)

    // Add pending on end date warning
    pendingOnEndDateWarning = new WarningModel()
    pendingOnEndDateWarning.type = SC.WARNING_PENDING_ON_END_DATE

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(taskPlan.release._id), {
        name: 1,
        project: 1
    })
    //logger.debug('taskReportedAsPendingOnEndDate(): ', {release})
    pendingOnEndDateWarning.releases = [Object.assign({}, release.toObject(), {source: true})]
    //logger.debug('taskReportedAsPendingOnEndDate(): ', {releasePlan})
    pendingOnEndDateWarning.releasePlans = [Object.assign({}, releasePlan.toObject(), {
        source: true,
        employee: {
            _id: taskPlan.employee._id
        }
    })]


    // Other task plan that are in pending status of max reported date would also be added against warning
    let taskPlans = await MDL.TaskPlanningModel.find({
        'employee._id': taskPlan.employee._id,
        'releasePlan._id': releasePlan._id,
        'planningDate': U.dateInUTC(taskPlan.planningDateString),
        'report.status': SC.STATUS_PENDING
    }).lean()

    logger.debug("taskReopenedPendingOnEndDate(): ", {taskPlans})

    if (taskPlans && taskPlans.length) {
        taskPlans.push(Object.assign({}, taskPlan.toObject(), {
            source: true
        }))
        pendingOnEndDateWarning.taskPlans = taskPlans
    } else {
        pendingOnEndDateWarning.taskPlans = [Object.assign({}, taskPlan.toObject(), {
            source: true
        })]
    }

    //logger.debug('taskReportedAsPendingOnEndDate():  creating warning ', {warning: pendingOnEndDateWarning})
    await pendingOnEndDateWarning.save()

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

    pendingOnEndDateWarning.taskPlans.forEach(t => {
        warningResponse.added.push({
            _id: t._id,
            warningType: SC.WARNING_TYPE_TASK_PLAN,
            source: t.source,
            type: SC.WARNING_PENDING_ON_END_DATE
        })
    })

    return warningResponse

}

/**
 * Warnings handling when task is reopened would be handled in this method
 * @param taskPlan
 * @returns {Promise.<*>}
 */

warningSchema.statics.taskReopened = async (taskPlan, releasePlan, extra) => {
    let {onEndDate, beforeEndDate} = extra

    let warningResponse = {
        added: [],
        removed: []
    }

    if (onEndDate) {
        let pendingOnEndDateWarning = await taskReopenedPendingOnEndDate(taskPlan, releasePlan)
        copyWarnings(pendingOnEndDateWarning, warningResponse)
    }

    if (beforeEndDate) {
        // task reopend before end date there must be completed before end date warning, delete that warning now
        let completedBeforeEndDateWarning = await deleteCompletedBeforeEndDate(taskPlan, releasePlan)
        copyWarnings(completedBeforeEndDateWarning, warningResponse)
    }

    return warningResponse
}

warningSchema.statics.releasePlanRemoved = async (releasePlan) => {
    // As release plan is removed we need to remove all warnings that is associated with this release plan

    let removeWarnings = await WarningModel.remove({
        'releasePlans._id': releasePlan._id
    })

    // Return empty warning response as release plan is already removed which means task plan and release plan would not be there and hence
    // no need to update their flags
    return {
        added: [],
        removed: []
    }
}

/**
 * Called to handle warnings generated due to update of release plan
 * @param releasePlan
 * @param extra
 */
warningSchema.statics.releasePlanUpdated = async (releasePlan, release, extra) => {
    const {oldEstimatedHours} = extra

    logger.debug("WarningModel.releasePlanUpdated() ", {
        oldEstimatedHours,
        plannedHours: releasePlan.planning.plannedHours,
        newEstimated: releasePlan.task.estimatedHours
    })
    // Handling less planned hours

    // Find out if less planned hours is associated with this release plan

    let warningResponse = {
        added: [],
        removed: []
    }

    if (releasePlan.task.estimatedHours < releasePlan.planning.plannedHours) {
        // this means new estimation is less than planned hours
        if (oldEstimatedHours > releasePlan.planning.plannedHours) {
            // there should be a less planned hours warning that should now be removed
            let lessPlannedWarning = await deleteLessPlannedHours(releasePlan)
            logger.debug("releasePlanUpdated(): ", {lessPlannedWarning})
            copyWarnings(lessPlannedWarning, warningResponse)
        }

        if (oldEstimatedHours >= releasePlan.planning.plannedHours) {
            // More planned hours warning should be added
            let morePlannedWarnings = await addMorePlannedHours(releasePlan, release)
            logger.debug("releasePlanUpdated(): ", {morePlannedWarnings})
            copyWarnings(morePlannedWarnings, warningResponse)
        }
    }

    if (releasePlan.task.estimatedHours > releasePlan.planning.plannedHours) {
        // this means estimation is greater than planned hours following case would arise
        if (oldEstimatedHours < releasePlan.planning.plannedHours) {
            let morePlannedWarning = await deleteMorePlannedHours(releasePlan)
            logger.debug("releasePlanUpdated(): ", {morePlannedWarning})
            copyWarnings(morePlannedWarning, warningResponse)
        }

        if (oldEstimatedHours <= releasePlan.planning.plannedHours) {
            let lessPlannedWarnings = await addLessPlannedHours(releasePlan, release)
            logger.debug("releasePlanUpdated(): ", {lessPlannedWarnings})
            copyWarnings(lessPlannedWarnings, warningResponse)
        }
    }

    if (releasePlan.task.estimatedHours == releasePlan.planning.plannedHours) {
        if (oldEstimatedHours < releasePlan.planning.plannedHours) {
            let morePlannedWarning = await deleteMorePlannedHours(releasePlan)
            logger.debug("releasePlanUpdated(): ", {morePlannedWarning})
            copyWarnings(morePlannedWarning, warningResponse)
        }

        if (oldEstimatedHours > releasePlan.planning.plannedHours) {
            // there should be a less planned hours warning that should now be removed
            let lessPlannedWarning = await deleteLessPlannedHours(releasePlan)
            logger.debug("releasePlanUpdated(): ", {lessPlannedWarning})
            copyWarnings(lessPlannedWarning, warningResponse)
        }
    }

    let moreReportedWarnings = await updateMoreReportedHours(releasePlan, release)
    copyWarnings(moreReportedWarnings, warningResponse)

    return warningResponse
}


const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
