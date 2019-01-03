import mongoose from 'mongoose'
import momentTZ from 'moment-timezone'
import logger from '../logger'


mongoose.Promise = global.Promise

let monthlySummaryEmployeeSchema = mongoose.Schema({
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String, required: [true, 'Employee name is required'] },
    },
    monthStartDate: { type: Date }, // helps in uniquely identifying month in a summary
    year: { type: String }, // complete year, helps in creating yearly summary from monthly summary
    plannedHours: { type: Number, default: 0 }, // Planned hours against this employee in a month (reported tasks)
    reportedHours: { type: Number, default: 0 }, // Reported hours against this employee in a month (reported tasks)
    unbilledHours: { type: Number, default: 0 }, // Unbilled hours against this employee in a month
    billedHours: { type: Number, default: 0 }, // Billed hours against this employee in a month
    // Unbilled amount - Amount of tasks which are not yet added to timesheet
    unbilledAmount: { type: Number, default: 0 },
    // Billing amount - Amount of tasks which are added to timesheet but not sent to client
    billingAmount: { type: Number, default: 0 },
    // Billed amount- Amount of tasks for which timesheet is sent to client 
    billedAmount: { type: Number, default: 0 },
    // Paid amount - Amount of tasks whose timesheet is paid by client
    paidAmount: { type: Number, default: 0 }
}, {
        usePushEach: true
    })

/**
 * Modify client monthly summary when billing task is added
 */
monthlySummaryEmployeeSchema.statics.billingTaskCreated =  async (billingTask) => {
    // As billing task is added company monthly summary would be updated to add amounts
    // From billing task get the start of the month
    let monthStartDate = momentTZ(billingTask.billingDate).utc().startOf('months')
    logger.debug("monthlySummaryCompany->billingTaskCreated() ", { monthStartDate })

    let monthlySummary = await MonthlySummaryEmployeeModel.findOne({
        monthStartDate,
        "employee._id": billingTask.billingEmployee._id
    })

    logger.debug("monthly summary found as ", monthlySummary)

    if (!monthlySummary) {
        monthlySummary = new MonthlySummaryEmployeeModel()
        monthlySummary.employee = billingTask.billingEmployee
        monthlySummary.monthStartDate = monthStartDate
        monthlySummary.unbilledHours = billingTask.billedHours
        monthlySummary.reportedHours = billingTask.taskPlan.report.reportedHours
        monthlySummary.unbilledAmount = billingTask.billingAmount
        await monthlySummary.save()
    } else {
        monthlySummary.unbilledHours += billingTask.billedHours
        monthlySummary.reportedHours += billingTask.taskPlan.report.reportedHours
        monthlySummary.unbilledAmount += billingTask.billingAmount
        await monthlySummary.save()
    }
}


const MonthlySummaryEmployeeModel = mongoose.model("MonthlySummaryEmployee", monthlySummaryEmployeeSchema)
export default MonthlySummaryEmployeeModel