import mongoose from 'mongoose'


mongoose.Promise = global.Promise

let monthlySummaryEmployeeSchema = mongoose.Schema({
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String, required: [true, 'Employee name is required'] },
    },
    monthStartDate: { type: Date }, // helps in uniquely identifying month in a summary
    year: { type: String }, // complete year, helps in creating yearly summary from monthly summary
    unbilledHours: { type: Number, default: 0 }, // Unbilled hours against this employee in a month
    billedHours: { type: Number, default: 0 }, // Billed hours against this employee in a month
    plannedHours: { type: Number, default: 0 }, // Planned hours against this employee in a month (reported tasks)
    reportedHours: { type: Number, default: 0 } // Reported hours against this employee in a month (reported tasks)
}, {
        usePushEach: true
    })

const MonthlySummaryEmployeeModel = mongoose.model("MonthlySummaryEmployee", monthlySummaryEmployeeSchema)
export default MonthlySummaryEmployeeModel