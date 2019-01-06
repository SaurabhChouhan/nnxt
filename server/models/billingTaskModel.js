import mongoose from 'mongoose'
import * as MDL from '../models'
import { BILLING_STATUS_UNBILLED, BILLING_STATUS_BILLED, BILLING_STATUS_PAID, BILLING_STATUS_BILLING_CREATED, REPORT_PENDING, REPORT_COMPLETED, DATE_AND_DAY_SHOW_FORMAT, DATE_DISPLAY_FORMAT, DATE_FORMAT } from '../serverconstants'
mongoose.Promise = global.Promise
import logger from '../logger'
import AppError from '../AppError';
import { NO_BILLING_RATE, ACCESS_DENIED, HTTP_FORBIDDEN } from '../errorcodes'
import { userHasRole, momentInUTC } from '../utils'
import { ROLE_TOP_MANAGEMENT } from '../serverconstants'

let billingTaskSchema = mongoose.Schema({
    billedDate: Date,
    billedHours: { type: Number, default: 0 },
    description: String, // Timesheet description
    billingRate: { type: Number, default: 0 }, // Billing rate this billing task would be charged
    billingAmount: { type: Number, default: 0 }, // billing rate * billed hours
    status: { type: String, enum: [BILLING_STATUS_UNBILLED, BILLING_STATUS_BILLED, BILLING_STATUS_BILLING_CREATED, BILLING_STATUS_PAID], default: BILLING_STATUS_UNBILLED },
    // Developer against which this earning would go against
    billingEmployee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    // Employee shown in timesheet
    timesheetEmployee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    timeSheet: {
        _id: mongoose.Schema.ObjectId
    },
    taskPlan: {
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId,
            name: { type: String, required: [true, 'employee name is required'] }
        },
        planningDate: Date,
        report: {
            status: {
                type: String,
                enum: [REPORT_COMPLETED, REPORT_PENDING]
            },
            reportedHours: { type: Number, default: 0 },
            description: String
        }
    },
    releasePlan: {
        _id: mongoose.Schema.ObjectId,
        task: {
            name: String
        }
    },
    release: {
        _id: mongoose.Schema.ObjectId
    },
    project: {
        _id: mongoose.Schema.ObjectId
    },
    client: {
        _id: mongoose.Schema.ObjectId
    }
})

billingTaskSchema.statics.createBillingTaskFromReportedTask = async (taskPlan) => {
    let release = await MDL.ReleaseModel.findById(taskPlan.release._id)
    let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, { "task.name": 1, 'release': 1 })
    logger.debug("createBillingTaskFromReportedTask() ", { release, releasePlan })

    if (!release.billingRate)
        throw new AppError('No billing rate provided for release [' + release.name + "] of project [" + release.project.name + "] for client [" + release.client.name + "]", NO_BILLING_RATE)

    let billingTask = new BillingTaskModel()
    billingTask.billedDate = taskPlan.planningDate
    billingTask.billedHours = taskPlan.report.reportedHours
    billingTask.billingAmount = taskPlan.report.reportedHours * release.billingRate
    billingTask.description = taskPlan.report.description
    billingTask.status = BILLING_STATUS_UNBILLED
    billingTask.billingEmployee = taskPlan.employee
    billingTask.timesheetEmployee = taskPlan.employee
    billingTask.taskPlan = taskPlan
    billingTask.release = release
    billingTask.releasePlan = releasePlan
    billingTask.client = release.client
    billingTask.project = release.project
    await billingTask.save()
    logger.debug("Billing task created as ", { billingTask })
    await MDL.MonthlySummaryCompanyModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryClientModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryEmployeeModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryProjectModel.billingTaskCreated(billingTask)
    // increment unbilled hours in release plan/release

    let releaseUpdates = {}
    releaseUpdates['$inc'] = {}
    releaseUpdates['$inc']['iterations.' + releasePlan.release.iteration.idx + '.unbilledHours'] = billingTask.billedHours

    logger.debug("release updates formed as ", { releaseUpdates })

    await MDL.ReleaseModel.updateOne({
        '_id': billingTask.release._id
    }, releaseUpdates)

    await MDL.ReleasePlanModel.updateOne({
        '_id': billingTask.releasePlan._id
    }, {
            $inc: { 'billing.unbilledHours': billingTask.billedHours }
        })

    return billingTask
}

billingTaskSchema.statics.searchBillingTask = async (criteria, user) => {
    if (!userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        throw new AppError('Only user with role [' + ROLE_TOP_MANAGEMENT + '] can search for billing tasks', ACCESS_DENIED, HTTP_FORBIDDEN)
    }

    console.log('criteria received ', criteria)
    let crit = {
        'client._id': mongoose.Types.ObjectId(criteria.clientID),
        'release._id': mongoose.Types.ObjectId(criteria.releaseID)
    }

    let release = await MDL.ReleaseModel.findById(criteria.releaseID, { project: 1, client: 1, name: 1, billingRate: 1, "iterations.billedAmount": 1, "iterations.unbilledAmount": 1, "team": 1, "nonProjectTeam": 1 })

    logger.debug("release found as ", { release })

    let fromMoment = undefined
    let toMoment = undefined

    if (criteria.fromDate) {
        fromMoment = momentInUTC(criteria.fromDate)
    }

    if (criteria.toDate) {
        toMoment = momentInUTC(criteria.toDate)
    }

    if (fromMoment && toMoment && fromMoment.isValid() && toMoment.isValid()) {
        crit['$and'] = [{ 'billedDate': { $gte: fromMoment.toDate() } }, { 'billedDate': { $lte: toMoment.toDate() } }]
    } else if (fromMoment && fromMoment.isValid()) {
        crit['billedDate'] = { $gte: fromMoment.toDate() }
    } else if (toMoment && toMoment.isValid()) {
        crit['billedDate'] = { $lte: toMoment.toDate() }
    }

    let billingTasks = await BillingTaskModel.aggregate([{
        $match: crit
    }, {
        $sort: { 'billedDate': 1 }
    }, {
        $project: {
            "release": 0,
            "project": 0,
            "client": 0
        }
    }])

    if (billingTasks && billingTasks.length) {
        let releasePlans = await processBillingTasks(billingTasks, release.billingRate)
        return {
            release,
            releasePlans
        };
    } else {
        return {
            release,
            releasePlans: []
        }
    }
}

const processBillingTasks = async (billingTasks, billingRate) => {

    let releasePlans = []
    for (let billingTask of billingTasks) {
        logger.debug("Iterating on billing task " + billingTask._id)
        let idx = releasePlans.findIndex(r => r._id.toString() == billingTask.releasePlan._id.toString())
        if (idx == -1) {
            logger.debug("release plan not found in release plans ")
            let releasePlan = await MDL.ReleasePlanModel.findById(billingTask.releasePlan._id,
                { 'task.name': 1, 'task.estimatedBilledHours': 1, 'report.progress': 1, 'report.unbilledAmount': 1, 'report.billingAmount': 1 }
            )

            let estimatedAmount = releasePlan.task.estimatedBilledHours * billingRate
            let earnedAmount = parseFloat((releasePlan.report.progress * estimatedAmount * 0.01).toFixed(2))
            let unbilledAmount = releasePlan.report.unbilledAmount ? releasePlan.report.unbilledAmount : 0
            let billingAmount = releasePlan.report.billingAmount ? releasePlan.report.billingAmount : 0
            let suggestedAmount = earnedAmount - unbilledAmount - billingAmount

            releasePlans.push({
                _id: releasePlan._id,
                name: releasePlan.task.name,
                estimatedAmount,
                earnedAmount,
                unbilledAmount,
                billingAmount,
                suggestedAmount,

                taskPlans: [{
                    _id: billingTask.taskPlan._id,
                    employeeName: billingTask.taskPlan.employee.name,
                    planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT),
                    reportedHours: billingTask.taskPlan.report.reportedHours,
                    description: billingTask.taskPlan.report.description,
                    billingTasks: [Object.assign({}, billingTask, {
                        taskPlan: undefined,
                        releasePlan: undefined,
                        billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                    })]
                }]
            })
        } else {
            // release plan entry is present
            let releasePlan = releasePlans[idx]
            logger.debug("release plan found in releaseplans ", { releasePlan })

            // We would have to add this billing task to appropriate task plan inside this release plan
            let taskPlanIdx = releasePlan.taskPlans.findIndex(tp => tp._id.toString() == billingTask.taskPlan._id.toString())
            if (taskPlanIdx == -1) {
                releasePlan.taskPlans.push({
                    _id: billingTask.taskPlan._id,
                    employeeName: billingTask.taskPlan.employee.name,
                    planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT),
                    reportedHours: billingTask.taskPlan.report.reportedHours,
                    description: billingTask.taskPlan.report.description,
                    billingTasks: [Object.assign({}, billingTask, {
                        taskPlan: undefined,
                        releasePlan: undefined,
                        billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                    })]
                })
            } else {
                releasePlan.taskPlans[taskPlanIdx].billingTasks.push(Object.assign({}, billingTask, {
                    taskPlan: undefined,
                    releasePlan: undefined,
                    billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                }))
            }
        }
    }

    return releasePlans;
}


const BillingTaskModel = mongoose.model('BillingTask', billingTaskSchema)
export default BillingTaskModel
