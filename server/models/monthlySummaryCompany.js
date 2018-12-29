import mongoose from 'mongoose'


mongoose.Promise = global.Promise

let monthlySummaryCompanySchema = mongoose.Schema({
    monthStartDate: { type: Date }, // helps in uniquely identifying month in a summary
    year: { type: String }, // complete year, helps in creating yearly summary from monthly summary
    unbilledHours: { type: Number, default: 0 }, // Unbilled hours for company in a month
    billedHours: { type: Number, default: 0 }, // Billed hours for company in a month
    billedAmount: { type: Number, default: 0 }, // Billed amount for company in a month
    plannedHours: { type: Number, default: 0 }, // Planned hours for company in a month (reported tasks)
    reportedHours: { type: Number, default: 0 } // Reported hours for company in a month (reported tasks)
}, {
        usePushEach: true
    })



const MonthlySummaryClientModel = mongoose.model("MonthlySummaryClient", monthlySummaryCompanySchema)
export default MonthlySummaryClientModel