import mongoose from 'mongoose'
import { BILLING_STATUS_UNBILLED, BILLING_STATUS_BILLED, BILLING_STATUS_PAID, BILLING_STATUS_ENTRY_CREATED } from '../serverconstants'
mongoose.Promise = global.Promise

let billingTaskSchema = mongoose.Schema({
    billedDate: Date,
    billedHours: { type: Number, default: 0 },
    description: String, // Timesheet description
    billingRate: { type: Number, default: 0 }, // Billing rate this billing task would be charged
    billingAmount: { type: Number, default: 0 }, // billing rate * billed hours
    status: { type: String, enum: [BILLING_STATUS_UNBILLED, BILLING_STATUS_BILLED, BILLING_STATUS_ENTRY_CREATED, BILLING_STATUS_PAID], default: BILLING_STATUS_UNBILLED },
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
                enum: [SC.REPORT_COMPLETED, SC.REPORT_PENDING]
            },
            reportedHours: { type: Number, default: 0 },
            description: String
        }
    },
    releasePlan: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
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

billingTaskSchema.statics.createBillingTaskFromReportedTask = (taskPlan, releasePlan, release) => {
    let billingTask = new BillingTaskModel()
    billingTask.billedDate = taskPlan.plannedOnDate
    billingTask.billedHours = taskPlan.report.reportedHours
    billingTask.billingAmount = taskPlan.report.reportedHours * release.billingRate
    billingTask.description = taskPlan.report.description
    billingTask.status = BILLING_STATUS_UNBILLED
    billingTask.billingEmployee = taskPlan.employee
    billingTask.timesheetEmployee = taskPlan.employee
    billingTask.taskPlan = taskPlan
    billingTask.release = release
    billingTask.releasePlan = releasePlan



}

const BillingTaskModel = mongoose.model('BillingTask', billingTaskSchema)
export default BillingTaskModel
