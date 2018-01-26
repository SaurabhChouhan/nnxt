import mongoose from 'mongoose'
import AppError from '../AppError'
import {ProjectModel, UserModel} from "./index"
import {
    ROLE_ESTIMATOR,
    STATUS_APPROVED,
    STATUS_CHANGE_REQUESTED,
    STATUS_ESTIMATION_REQUESTED,
    STATUS_INITIATED,
    STATUS_PROJECT_AWARDED,
    STATUS_REOPENED,
    STATUS_REVIEW_REQUESTED
} from "../serverconstants"
import {NOT_FOUND, INVALID_USER, HTTP_BAD_REQUEST} from "../errorcodes"
import {userHasRole} from "../utils"
import {validate, generateSchema, estimationInitiationStruct} from "../validation"

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
        firstName: String,
        lastName: String
    },
    negotiator: {
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        lastName: String
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
        date: {type: Date, default: Date.now()}
    }]
})


/**
 * Estimation request is initiated by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.initiate = async (estimationInput, negotiator) => {

    // validate input
    validate(estimationInput, estimationInitiationStruct)

    // enhance estimation input as per requirement
    if (!negotiator)
        throw new AppError('Negotiator not found', NOT_FOUND, HTTP_BAD_REQUEST)

    let project = await ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', NOT_FOUND, HTTP_BAD_REQUEST)

    let estimator = await UserModel.findById(estimationInput.estimator._id)
    if (!userHasRole(estimator, ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', INVALID_USER, HTTP_BAD_REQUEST)

    if (!estimator)
        throw new AppError('Estimator not found', NOT_FOUND, HTTP_BAD_REQUEST)

    estimationInput.status = STATUS_INITIATED
    estimationInput.project = project
    estimationInput.client = project.client
    estimationInput.estimator = estimator
    estimationInput.negotiator = negotiator
    estimationInput.statusHistory = [{
        name: negotiator.name,
        status: STATUS_INITIATED

    }]
    return await EstimationModel.create(estimationInput)
}

const EstimationModel = mongoose.model("Estimation", estimationSchema)
export default EstimationModel