import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {
    OWNER_ESTIMATOR,
    OWNER_NEGOTIATOR,
    STATUS_APPROVED,
    STATUS_PENDING,
    ROLE_ESTIMATOR,
    ROLE_NEGOTIATOR
} from "../serverconstants"
import {validate, estimationEstimatorAddTaskStruct} from "../validation"
import {userHasRole} from "../utils"
import {EstimationModel} from "./"
import {INVALID_USER, NOT_FOUND, HTTP_BAD_REQUEST} from "../errorcodes"

mongoose.Promise = global.Promise

let estimationTaskSchema = mongoose.Schema({
    status: {type: String, enum: [STATUS_APPROVED, STATUS_PENDING], required: true, default: STATUS_PENDING},
    owner: {type: String, enum: [OWNER_ESTIMATOR, OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    initiallyEstimated: {type: Boolean, required: true},
    created: Date,
    updated: Date,
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true}
    },
    feature: {
        _id: {type: mongoose.Schema.ObjectId}
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

estimationTaskSchema.statics.addTaskByEstimator = async (taskInput, estimator) => {
    validate(taskInput, estimationEstimatorAddTaskStruct)
    if (!estimator || !userHasRole(estimator, ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', INVALID_USER, HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', NOT_FOUND, HTTP_BAD_REQUEST)

    if (taskInput.feature && taskInput.feature._id) {
        // task is part of some feature,
        // TODO: Need to find feature from {EstimationFeature} and add validation
    }

    if (taskInput.repo && taskInput.repo._id) {
        // task is added from repository
        // TODO: Need to find task from {Repository} and add validation
    } else {
        // TODO: Need to save this task to {Repository} and add identifier here
        taskInput.repo = {
            addedFromThisEstimation: true
        }
    }

    // create estimator section

    let estimatorSection = {}
    estimatorSection.name = taskInput.name
    estimatorSection.description = taskInput.description
    estimatorSection.estimatedHours = taskInput.estimatedHours

    taskInput.status = STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = OWNER_ESTIMATOR
    taskInput.initiallyEstimated = true

    taskInput.estimator = estimatorSection
    return await EstimationTaskModel.create(taskInput)

}


const EstimationTaskModel = mongoose.model("EstimationTask", estimationTaskSchema)
export default EstimationTaskModel
