import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'

mongoose.Promise = global.Promise

let estimationTaskSchema = mongoose.Schema({
    estimation: {
        _id: mongoose.Schema.ObjectId
    },
    feature: {
        _id: mongoose.Schema.ObjectId
    },
    addedFromRepository: {type: Boolean, required: true},
    addedInThisIteration: {type: Boolean, required: true},
    task: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: true},
        description: {type: String},
    },
    technologies: [String],
    tags: [String],
    estimatedHours: {type: Number, required: true},
    suggestedHours: {type: Number, required: true},
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }],
    initiallyEstimated: {type: Boolean, required: true},
    status: {type: String, enum: ["approved", "correction-needed", "corrected"]},
    requestedRemoval: {type: Boolean, required: true},
    needRemovalPermission: {type: Boolean, required: true},
    needCorrectionPermission: {type: Boolean, required: true}
})


const EstimationTaskModel = mongoose.model("Estimation", estimationTaskSchema)
export default EstimationTaskModel
