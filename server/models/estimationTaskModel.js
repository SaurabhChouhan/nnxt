import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from "../serverconstants"
import {
    validate,
    estimationEstimatorAddTaskStruct,
    estimationNegotiatorAddTaskStruct,
    estimationEstimatorMoveToFeatureStruct
} from "../validation"
import {userHasRole} from "../utils"
import {EstimationModel, RepositoryModel, EstimationFeatureModel} from "./"
import _ from 'lodash'

mongoose.Promise = global.Promise

let estimationTaskSchema = mongoose.Schema({
    status: {type: String, enum: [SC.STATUS_APPROVED, SC.STATUS_PENDING], required: true, default: SC.STATUS_PENDING},
    owner: {type: String, enum: [SC.OWNER_ESTIMATOR, SC.OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    initiallyEstimated: {type: Boolean, required: true},
    isDeleted: {type: Boolean, default: false},
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
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false},
        isMovedToFeature: {type: Boolean, default: false},
        isMovedOutOfFeature: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeRequested: {type: Boolean, default: false},
        changeGranted: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false},
        isMovedToFeature: {type: Boolean, default: false},
        isMovedOutOfFeature: {type: Boolean, default: false}
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
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('You are not estimator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    if (taskInput.feature && taskInput.feature._id) {
        // task is part of some feature,
        let estimationFeature = await EstimationFeatureModel.findById(taskInput.feature._id)

        console.log("estimator feature found as ", estimationFeature)
        if (!estimationFeature || estimationFeature.estimation._id.toString() != estimation._id.toString()) {
            throw new AppError('No such feature in this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }
    }

    let repositoryTask = undefined

    if (taskInput.repo && taskInput.repo._id) {
        // task is added from repository
        // find if task actually exists there
        repositoryTask = await RepositoryModel.findById(taskInput.repo._id)
        if (!repositoryTask)
            throw new AppError('Task not part of repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // as this task was found in repository, this means that this is already part of repository
        taskInput.repo = {
            addedFromThisEstimation: false,
            _id: repositoryTask._id
        }
    } else {
        /**
         * As no repo id is sent, this means that this is a new task, hence save this task into repository
         * @type {{addedFromThisEstimation: boolean}}
         */

        repositoryTask = await RepositoryModel.addTask({
            name: taskInput.name,
            description: taskInput.description,
            estimation: {
                _id: estimation._id.toString()
            },
            feature: taskInput.feature,
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

    taskInput.status = SC.STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = SC.OWNER_ESTIMATOR
    taskInput.initiallyEstimated = true

    taskInput.estimator = estimatorSection
    /**
     * Add name of logged in user against notes
     */

    if (!_.isEmpty(taskInput.notes)) {
        taskInput.notes = taskInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }
    return await EstimationTaskModel.create(taskInput)

}

estimationTaskSchema.statics.addTaskByNegotiator = async (taskInput, negotiator) => {
    validate(taskInput, estimationNegotiatorAddTaskStruct)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add task into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (taskInput.feature && taskInput.feature._id) {
        // task is part of some feature,
        // TODO: Need to find feature from {EstimationFeature} and add validation
    }

    let repositoryTask = undefined

    if (taskInput.repo && taskInput.repo._id) {
        // task is added from repository
        // find if task actually exists there
        repositoryTask = await RepositoryModel.findById(taskInput.repo._id)
        if (!repositoryTask)
            throw new AppError('Task not part of repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // as this task was found in repository, this means that this is already part of repository
        taskInput.repo = {
            addedFromThisEstimation: false,
            _id: repositoryTask._id
        }
    } else {
        /**
         * As no repo id is sent, this means that this is a new task, hence save this task into repository
         * @type {{addedFromThisEstimation: boolean}}
         */

        repositoryTask = await RepositoryModel.addTask({
            name: taskInput.name,
            description: taskInput.description,
            estimation: {
                _id: estimation._id.toString()
            },
            feature: taskInput.feature,
            createdBy: negotiator,
            technologies: taskInput.technologies,
            tags: taskInput.tags
        }, negotiator)

        taskInput.repo = {
            _id: repositoryTask._id,
            addedFromThisEstimation: true
        }
    }

    // create negotiator section

    let negotiatorSection = {}
    /* Name/description would always match repository name description */

    negotiatorSection.name = repositoryTask.name
    negotiatorSection.description = repositoryTask.description
    negotiatorSection.estimatedHours = taskInput.estimatedHours

    taskInput.status = SC.STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = SC.OWNER_NEGOTIATOR
    taskInput.initiallyEstimated = true
    taskInput.negotiator = negotiatorSection

    if (!_.isEmpty(taskInput.notes)) {
        taskInput.notes = taskInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    return await EstimationTaskModel.create(taskInput)
}

estimationTaskSchema.statics.getAllTaskOfEstimation = async (estimation_id) => {
    let tasksOfEstimation = await EstimationTaskModel.find({"estimation._id": estimation_id});
    return tasksOfEstimation;
}

estimationTaskSchema.statics.moveTaskToFeature = async (featureInput, estimator) => {

    validate(featureInput, estimationEstimatorMoveToFeatureStruct)

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVAstimation - LID_USER, EC.HTTP_BAD_REQUEST)

    let featureOfEstimation = await EstimationFeatureModel.findById(featureInput.feature_id)
    if (!featureOfEstimation)
        throw new AppError('Estimation feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let taskOfEstimation = await EstimationTaskModel.findById(featureInput.task_id)
    if (!taskOfEstimation)
        throw new AppError('Estimation task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": featureOfEstimation.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update feature(Move to Feature) into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    taskOfEstimation.feature = featureOfEstimation
    taskOfEstimation.updated = Date.now()
    if (!taskOfEstimation.addedInThisIteration || taskOfEstimation.owner != SC.OWNER_ESTIMATOR)
        taskOfEstimation.estimator.changedInThisIteration = true
    taskOfEstimation.estimator.isMovedToFeature = true
    taskOfEstimation.estimator.isMovedOutOfFeature = false

    return await taskOfEstimation.save();
}


const EstimationTaskModel = mongoose.model("EstimationTask", estimationTaskSchema)
export default EstimationTaskModel
