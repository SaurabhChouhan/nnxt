import mongoose from 'mongoose'
mongoose.Promise = global.Promise

let billingTaskSchema = mongoose.Schema({
    billedDate: Date,
    billedHours: Number,
    taskDescription: String,
    developer: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    taskPlan: {
        _id: mongoose.Schema.ObjectId
    },
    releasePlan: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    release: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    }
})

const BillingTaskModel = mongoose.model('BillingTask', billingTaskSchema)
export default BillingTaskModel
