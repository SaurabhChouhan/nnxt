import mongoose from 'mongoose'
mongoose.Promise = global.Promise

let billingTimeSheetSchema = mongoose.Schema({
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    project: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    startDate: Date, // Start of timesheet
    endDate: Date, // end of timesheet
    billedHours: { type: Number, default: 0 }, // total billed hours billed in this timesheet
    billingAmount: { type: Number, default: 0 } // Total billing amount billed in this timesheet
})

const BillingTimeSheetModel = mongoose.model('BillingTimeSheet', billingTimeSheetSchema)
export default BillingTimeSheetModel

