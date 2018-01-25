import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {validate, estimationInitiationStruct} from "../validation"
import {
    STATUS_APPROVED,
    STATUS_CHANGE_REQUESTED,
    STATUS_ESTIMATION_REQUESTED,
    STATUS_INITIATED,
    STATUS_PROJECT_AWARDED,
    STATUS_REOPENED,
    STATUS_REVIEW_REQUESTED
} from "../serverconstants"

mongoose.Promise = global.Promise

let estimationSchema = mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: [STATUS_INITIATED, STATUS_ESTIMATION_REQUESTED, STATUS_REVIEW_REQUESTED, STATUS_CHANGE_REQUESTED, STATUS_APPROVED, STATUS_REOPENED, STATUS_PROJECT_AWARDED]
    },
    technologies: [String],
    description: String,
    created: Date,
    updated: Date,
    estimator: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    negotiator: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    project: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    release: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }],
    statusHistory: [{
        name: String,
        status: String,
        date: Date
    }]
})


/**
 * Estimation request is initiated by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.initiate = (estimationInput) => {
    validate(estimationInput, estimationInitiationStruct)



    return true
}

const EstimationModel = mongoose.model("Estimation", estimationSchema)
export default EstimationModel