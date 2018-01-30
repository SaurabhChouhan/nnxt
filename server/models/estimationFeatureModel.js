import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {validate, estimationEstimatorAddFeatureStruct} from "../validation"
import {
    OWNER_ESTIMATOR,
    OWNER_NEGOTIATOR,
    STATUS_APPROVED,
    STATUS_PENDING,
    ROLE_ESTIMATOR,
    ROLE_NEGOTIATOR
} from "../serverconstants"
import {userHasRole} from "../utils"
import {EstimationModel, RepositoryModel} from "./"
import {INVALID_USER, NOT_FOUND, HTTP_BAD_REQUEST} from "../errorcodes"

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


estimationFeatureSchema.statics.addFeatureByEstimator = async (taskInput, estimator) => {
    validate(taskInput, estimationEstimatorAddFeatureStruct)
    if (!estimator || !userHasRole(estimator, ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', INVALID_USER, HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', NOT_FOUND, HTTP_BAD_REQUEST)

    let repositoryTask = undefined

    if (taskInput.repo && taskInput.repo._id) {
        // Feature is added from repository
        // find if Feature actually exists there
        repositoryTask = await RepositoryModel.findById(taskInput.repo._id)
        if (!repositoryTask)
            throw new AppError('Feature not part of repository', NOT_FOUND, HTTP_BAD_REQUEST)

        // as this feature was found in repository, this means that this is already part of repository
        taskInput.repo = {
            addedFromThisEstimation: false,
            _id: repositoryTask._id
        }
    } else {
        /**
         * As no repo id is sent, this means that this is a new feature, hence save this feature into repository
         * @type {{addedFromThisEstimation: boolean}}
         */

        repositoryTask = await RepositoryModel.addFeature({
            name: taskInput.name,
            description: taskInput.description,
            estimation: {
                _id: estimation._id.toString()
            },
            createdBy: estimator,
            technologies: taskInput.technologies,
            tags: taskInput.tags
        }, estimator)

        taskInput.repo = {
            _id: repositoryTask._id,
            addedFromThisEstimation: true
        }
    }

    // create estimator section

    let estimatorSection = {}
    /* Name/description would always match repository name description */

    estimatorSection.name = repositoryTask.name
    estimatorSection.description = repositoryTask.description
    estimatorSection.estimatedHours = taskInput.estimatedHours

    taskInput.status = STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = OWNER_ESTIMATOR
    taskInput.initiallyEstimated = true

    taskInput.estimator = estimatorSection
    return await EstimationFeatureModel.create(taskInput)

}



const EstimationFeatureModel = mongoose.model("EstimationFeature", estimationFeatureSchema)
export default EstimationFeatureModel