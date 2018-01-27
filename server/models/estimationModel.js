import mongoose from 'mongoose'
import AppError from '../AppError'
import {ProjectModel, UserModel, RepositoryModel} from "./index"

import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import {userHasRole} from "../utils"
import {validate, estimationInitiationStruct, estimationEstimatorAddTaskStruct} from "../validation"
import {STATUS_INITIATED} from "../serverconstants";

mongoose.Promise = global.Promise

let estimationSchema = mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: [SC.STATUS_INITIATED, SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_REVIEW_REQUESTED, SC.STATUS_CHANGE_REQUESTED, SC.STATUS_APPROVED, SC.STATUS_REOPENED, SC.STATUS_PROJECT_AWARDED]
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
    }],
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false}
})


estimationSchema.statics.getAllActive = async () => {
    return await EstimationModel.find({isArchived: false, isDeleted: false})
}

/**
 * Estimation request is initiated by Negotiator
 * @param estimationInput
 */
estimationSchema.statics.initiate = async (estimationInput, negotiator) => {

    // validate input
    validate(estimationInput, estimationInitiationStruct)

    // enhance estimation input as per requirement
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let project = await ProjectModel.findById(estimationInput.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimator = await UserModel.findById(estimationInput.estimator._id)
    if (!userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!estimator)
        throw new AppError('Estimator not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    estimationInput.status = SC.STATUS_INITIATED
    estimationInput.project = project
    estimationInput.client = project.client
    estimationInput.estimator = estimator
    estimationInput.negotiator = negotiator
    estimationInput.statusHistory = [{
        name: negotiator.firstName,
        status: SC.STATUS_INITIATED

    }]
    return await EstimationModel.create(estimationInput)
}

estimationSchema.statics.request = async (estimationID, negotiator) => {
    let estimation = await EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('No such estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('This estimation has different negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if(estimation.status != SC.STATUS_INITIATED)
        throw new AppError('Only estimations with status ['+STATUS_INITIATED+"] can be requested", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    estimation.status = SC.STATUS_ESTIMATION_REQUESTED
    estimation.statusHistory.push({
        name: estimation.negotiator.firstName,
        status: SC.STATUS_ESTIMATION_REQUESTED
    })
    return await estimation.save()
}


const EstimationModel = mongoose.model("Estimation", estimationSchema)
export default EstimationModel