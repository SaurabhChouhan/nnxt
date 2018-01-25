import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {STATUS_PENDING, STATUS_APPROVED, OWNER_NEGOTIATOR, OWNER_ESTIMATOR} from "../serverconstants"

mongoose.Promise = global.Promise

let estimationFeatureSchema = mongoose.Schema({
    status: {type: String, enum: [STATUS_APPROVED, STATUS_PENDING], required: true, default: STATUS_PENDING},
    owner: {type: String, enum: [OWNER_ESTIMATOR, OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    initiallyEstimated: {type: Boolean, required: true},
    created: Date,
    updated: Date,
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true}
    },
    repo: {
        _id: mongoose.Schema.ObjectId,
        addedFromThisEstimation: {type: Boolean, required: true}
    },
    estimator: {
        name: {type: String, required: true},
        description: {type: String, required: true},
        estimatedHours: {type: Number, required: true},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false}
    },
    technologies: [String],
    tags: [String],
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }]
})

const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel