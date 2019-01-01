import mongoose from 'mongoose'
import * as MDL from '../models'
import { BILLING_STATUS_UNBILLED, BILLING_STATUS_BILLED, BILLING_STATUS_PAID, BILLING_STATUS_BILLING_CREATED, REPORT_PENDING, REPORT_COMPLETED } from '../serverconstants'
mongoose.Promise = global.Promise
import logger from '../logger'
import AppError from '../AppError';
import { NO_BILLING_RATE } from '../errorcodes'

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

    let release = await MDL.ReleaseModel.findById(taskPlan.release._id, { project: 1, client: 1, name: 1, billingRate: 1 })
    let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, { "task.name": 1 })
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
    return await billingTask.save()
}

const BillingTaskModel = mongoose.model('BillingTask', billingTaskSchema)
export default BillingTaskModel
