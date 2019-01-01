import mongoose from 'mongoose'


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

const MonthlySummaryEmployeeModel = mongoose.model("MonthlySummaryEmployee", monthlySummaryEmployeeSchema)
export default MonthlySummaryEmployeeModel