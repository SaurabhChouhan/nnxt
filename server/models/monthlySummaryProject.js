import mongoose from 'mongoose'


mongoose.Promise = global.Promise

let monthlySummaryProjectSchema = mongoose.Schema({
    project: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String, required: [true, 'Project name is required'] },
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String, required: [true, 'Client name is required'] },
    },
    monthStartDate: { type: Date }, // helps in uniquely identifying month in a summary
    year: { type: String }, // complete year, helps in creating yearly summary from monthly summary
    unbilledHours: { type: Number, default: 0 }, // Unbilled hours against this project in a month
    billedHours: { type: Number, default: 0 }, // Billed hours against this project in a month
    billedAmount: { type: Number, default: 0 }, // Billed amount against this project in a month
    plannedHours: { type: Number, default: 0 }, // Planned hours against this project in a month (reported tasks)
    reportedHours: { type: Number, default: 0 } // Reported hours against this project in a month (reported tasks)
}, {
        usePushEach: true
})

const MonthlySummaryProjectModel = mongoose.model("MonthlySummaryProject", monthlySummaryProjectSchema)
export default MonthlySummaryProjectModel