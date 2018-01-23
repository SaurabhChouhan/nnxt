import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'

mongoose.Promise = global.Promise

let estimationFeatureSchema = mongoose.Schema({
    estimation: {
        _id: mongoose.Schema.ObjectId
    },
    feature: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: true},
        description: {type: String}
    },
    technologies: [String],
    tags: [String],
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }],
    initiallyEstimated: {type: Boolean, required: true},
    requestedRemoval: {type: Boolean, required: true},
    needRemovalPermission: {type: Boolean, required: true},
    needCorrectionPermission: {type: Boolean, required: true}
})

const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel