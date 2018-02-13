import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from "../serverconstants"
import {
    validate,
    estimationEstimatorAddTaskStruct,
    estimationEstimatorUpdateTaskStruct,
    estimationNegotiatorAddTaskStruct,
    estimationNegotiatorUpdateTaskStruct,
    estimationEstimatorMoveToFeatureStruct,
    estimationEstimatorMoveOutOfFeatureStruct,
    estimationNegotiatorMoveOutOfFeatureStruct,
    estimationNegotiatorMoveToFeatureStruct
} from "../validation"
import {userHasRole} from "../utils"
import {EstimationFeatureModel, EstimationModel, RepositoryModel} from "./"
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
        changedKeyInformation: {type: Boolean, default: false},
        removalRequested: {type: Boolean, default: false},
        changedInThisIteration: {type: Boolean, default: false},
        isMovedToFeature: {type: Boolean, default: false},
        isMovedOutOfFeature: {type: Boolean, default: false}
    },
    negotiator: {
        name: {type: String},
        description: {type: String},
        estimatedHours: {type: Number},
        changeSuggested: {type: Boolean, default: false},
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
        if (!estimationFeature || estimationFeature.estimation._id.toString() != estimation._id.toString()) {
            throw new AppError('No such feature in this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }
        // As task is being added into feature estimated hours of task would be added into current estimated hours of feature
        await EstimationFeatureModel.updateOne({_id: taskInput.feature._id}, {$inc: {"estimator.estimatedHours": taskInput.estimatedHours}})
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
            technologies: estimation.technologies, // Technologies of estimation would be copied directly to tasks
            tags: taskInput.tags
        }, estimator)

        taskInput.repo = {
            _id: repositoryTask._id,
            addedFromThisEstimation: true
        }
    }

    // create estimator section

    taskInput.status = SC.STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = SC.OWNER_ESTIMATOR
    taskInput.initiallyEstimated = true
    taskInput.changedKeyInformation = true
    taskInput.technologies = estimation.technologies
    taskInput.estimator = {
        name: repositoryTask.name,
        description: repositoryTask.description,
        estimatedHours: taskInput.estimatedHours
    }
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


estimationTaskSchema.statics.updateTaskByEstimator = async (taskInput, estimator) => {
    validate(taskInput, estimationEstimatorUpdateTaskStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationTask = await EstimationTaskModel.findById(taskInput._id)
    if (!estimationTask)
        throw new AppError('Estimation task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimationTask.owner == SC.OWNER_ESTIMATOR && !estimationTask.addedInThisIteration && !estimationTask.negotiator.changeSuggested && !estimationTask.negotiator.changeGranted) {
        throw new AppError('Not allowed to update task as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    } else if (estimationTask.owner == SC.OWNER_NEGOTIATOR && !estimationTask.negotiator.changeSuggested && !estimationTask.negotiator.changeGranted) {
        throw new AppError('Not allowed to update task as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
    }

    let estimation = await EstimationModel.findById(estimationTask.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimator._id.toString() != estimation.estimator._id.toString())
        throw new AppError('Invalid task for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimationTask.feature && estimationTask.feature._id) {
        let estimationFeatureObj = await EstimationFeatureModel.findById(taskInput.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() != estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        await EstimationFeatureModel.updateOne({_id: taskInput.feature._id}, {$inc: {"estimator.estimatedHours": taskInput.estimatedHours - estimationTask.estimator.estimatedHours}})
    }

    if (estimationTask.repo && estimationTask.repo._id) {
        // find repo and update when task is updating
        let repositoryTask = await
            RepositoryModel.updateTask(estimationTask.repo._id, taskInput, estimator)
    }

    estimationTask.feature = taskInput.feature
    estimationTask.estimator.name = taskInput.name
    estimationTask.estimator.description = taskInput.description
    estimationTask.estimator.estimatedHours = taskInput.estimatedHours
    if (!estimationTask.addedInThisIteration || estimationTask.owner != SC.OWNER_ESTIMATOR) {
        estimationTask.estimator.changedInThisIteration = true
        estimationTask.estimator.changedKeyInformation = true
    }

    estimationTask.updated = Date.now()

    if (!_.isEmpty(taskInput.notes)) {
        taskInput.notes = taskInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    let mergeAllNotes = []
    if (!_.isEmpty(estimationTask.notes)) {
        mergeAllNotes = estimationTask.notes
        taskInput.notes.map(n => {
            mergeAllNotes.push(n)
        })
    } else {
        mergeAllNotes = taskInput.notes
    }
    estimationTask.notes = mergeAllNotes
    return await estimationTask.save()

}


estimationTaskSchema.statics.updateTaskByNegotiator = async (taskInput, negotiator) => {
    validate(taskInput, estimationNegotiatorUpdateTaskStruct)
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let estimationTask = await EstimationTaskModel.findById(taskInput._id)
    if (!estimationTask)
        throw new AppError('Estimation task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findById(estimationTask.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (negotiator._id.toString() != estimation.negotiator._id.toString())
        throw new AppError('Invalid task for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only update task into those estimations where status is in [" + SC.STATUS_INITIATED + "," + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    /*
    if
    (estimationTask.repo && estimationTask.repo._id) {
        // find repo and update when task is updating
        let repositoryTask = await RepositoryModel.updateTask(estimationTask.repo._id, taskInput, negotiator)
    }*/

    estimationTask.feature = taskInput.feature
    estimationTask.negotiator.name = taskInput.name
    estimationTask.negotiator.description = taskInput.description
    estimationTask.negotiator.estimatedHours = taskInput.estimatedHours
    if (!estimationTask.addedInThisIteration || estimationTask.owner != SC.OWNER_NEGOTIATOR)
        estimationTask.negotiator.changedInThisIteration = true
    estimationTask.negotiator.changeSuggested = true

    estimationTask.updated = Date.now()

    if (!_.isEmpty(taskInput.notes)) {
        taskInput.notes = taskInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    let mergeAllNotes = []
    if (!_.isEmpty(estimationTask.notes)) {
        mergeAllNotes = estimationTask.notes
        taskInput.notes.map(n => {
            mergeAllNotes.push(n)
        })
    } else {
        mergeAllNotes = taskInput.notes
    }
    estimationTask.notes = mergeAllNotes
    return await estimationTask.save()

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

        let estimationFeatureObj = await EstimationFeatureModel.findById(taskInput.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() != estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // As task is being added by negotiator there would not be any change in estimated hours of feature as this would just be considered as suggestions
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


    negotiatorSection.name = repositoryTask.name
    negotiatorSection.description = repositoryTask.description
    negotiatorSection.estimatedHours = taskInput.estimatedHours
    negotiatorSection.changeRequested = true


    taskInput.status = SC.STATUS_PENDING
    taskInput.addedInThisIteration = true
    taskInput.owner = SC.OWNER_NEGOTIATOR
    taskInput.initiallyEstimated = true


    /* Name/description would always match repository name description
    * Add/edit of task by negotiator is considered suggestions. Change requested flag would allow estimator to see those changes*/

    taskInput.negotiator = {
        name: repositoryTask.name,
        description: repositoryTask.description,
        estimatedHours: taskInput.estimatedHours,
        changeSuggested: true
    }

    // Add name/description into estimator section as well, estimator can review and add estimated hours against this task
    taskInput.estimator = {
        name: repositoryTask.name,
        description: repositoryTask.description
    }

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

estimationTaskSchema.statics.moveTaskToFeatureByEstimator = async (featureInput, estimator) => {

    validate(featureInput, estimationEstimatorMoveToFeatureStruct)

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)


    let feature = await EstimationFeatureModel.findById(featureInput.feature_id)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(featureInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only move task to feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    // As task is being moved to feature, estimated hours of this task would be added into estimated hours of feature (only if estimator.estimatedHours has value
    if (task.estimator.estimatedHours) {
        await EstimationFeatureModel.updateOne({_id: feature._id}, {$inc: {"estimator.estimatedHours": task.estimator.estimatedHours}})
    }

    task.feature = feature
    task.updated = Date.now()
    if (!task.addedInThisIteration || task.owner != SC.OWNER_ESTIMATOR)
        task.estimator.changedInThisIteration = true
    task.estimator.isMovedToFeature = true
    task.estimator.isMovedOutOfFeature = false
    return await task.save();
}

estimationTaskSchema.statics.moveTaskOutOfFeatureByEstimator = async (featureInput, estimator) => {

    validate(featureInput, estimationEstimatorMoveOutOfFeatureStruct)

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureInput.feature_id)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(featureInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update feature(Move task out of Feature) into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    // As task is moved out of feature we would have to subtract hours ($inc with minus) of this task from overall estimated hours of feature
    if (task.estimator.estimatedHours)
        await EstimationFeatureModel.updateOne({_id: feature._id}, {$inc: {"estimator.estimatedHours": -task.estimator.estimatedHours}})

    task.feature = null
    task.updated = Date.now()
    task.estimator.isMovedToFeature = false
    task.estimator.isMovedOutOfFeature = true
    if (!task.addedInThisIteration || task.owner != SC.OWNER_ESTIMATOR)
        task.estimator.changedInThisIteration = true
    return await task.save();
}

estimationTaskSchema.statics.requestRemovalTaskByEstimator = async (taskID, estimator) => {

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update removal task flag into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    task.estimator.removalRequested = !task.estimator.removalRequested
    task.estimator.changedInThisIteration = true

    return await task.save();

    //const updatedTask = await task.save();
    //return {removalRequested:updatedTask.estimator.removalRequested}
}


estimationTaskSchema.statics.requestEditPermissionOfTaskByEstimator = async (taskInput, estimator) => {
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only request edit task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    task.estimator.changeRequested = !task.estimator.changeRequested
    task.estimator.changedInThisIteration = true
    return await task.save()
}

estimationTaskSchema.statics.moveTaskToFeatureByNegotiator = async (featureInput, negotiator) => {

    validate(featureInput, estimationNegotiatorMoveToFeatureStruct)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureInput.feature_id)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(featureInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only move task to feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    // As task is being moved to feature, estimated hours of this task would be added into estimated hours of feature (only if estimator.estimatedHours has value
    if (task.estimator.estimatedHours) {
        await EstimationFeatureModel.updateOne({_id: feature._id}, {$inc: {"estimator.estimatedHours": task.estimator.estimatedHours}})
    }

    task.feature = feature
    task.updated = Date.now()
    if (!task.addedInThisIteration || task.owner != SC.OWNER_NEGOTIATOR)
        task.negotiator.changedInThisIteration = true
    task.negotiator.isMovedToFeature = true
    task.negotiator.isMovedOutOfFeature = false

    return await task.save();
}

estimationTaskSchema.statics.deleteTaskByEstimator = async (paramsInput, estimator) => {
    //console.log("deleteTaskByEstimator for paramsInput ", paramsInput)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(paramsInput.taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": paramsInput.estimationID})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id != estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (task.owner != SC.OWNER_ESTIMATOR)
        throw new AppError('You are not owner of this task', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    if (!task.addedInThisIteration)
        throw new AppError('You are not allowed to delete this task', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    if (task.feature && task.feature._id) {
        let feature = await EstimationFeatureModel.findById(task.feature._id)
    if (!feature)
            throw new AppError('Feature that this task is associated with is not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // As task is removed we have to subtract hours ($inc with minus) of this task from overall estimated hours of feature
        if (task.estimator.estimatedHours)
            await EstimationFeatureModel.updateOne({_id: feature._id}, {$inc: {"estimator.estimatedHours": -task.estimator.estimatedHours}})

}
    task.isDeleted = true
    task.estimator.changedInThisIteration = true
    task.updated = Date.now()
    return await task.save()
}

estimationTaskSchema.statics.moveTaskOutOfFeatureByNegotiator = async (featureInput, negotiator) => {

    validate(featureInput, estimationNegotiatorMoveOutOfFeatureStruct)

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let feature = await EstimationFeatureModel.findById(featureInput.feature_id)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(featureInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only update feature(Move task out of feature) into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    // As task is moved out of feature we would have to subtract hours ($inc with minus) of this task from overall estimated hours of feature
    if (task.estimator.estimatedHours)
        await EstimationFeatureModel.updateOne({_id: feature._id}, {$inc: {"estimator.estimatedHours": -task.estimator.estimatedHours}})

    task.feature = null
    task.updated = Date.now()
    task.negotiator.isMovedToFeature = false
    task.negotiator.isMovedOutOfFeature = true
    if (!task.addedInThisIteration || task.owner != SC.OWNER_NEGOTIATOR)
        task.negotiator.changedInThisIteration = true
    return await task.save();
}


estimationTaskSchema.statics.grantEditPermissionOfTaskByNegotiator = async (taskInput, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskInput.task_id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only given grant edit permission to task into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!task.addedInThisIteration || task.owner != SC.OWNER_NEGOTIATOR)
        task.negotiator.changedInThisIteration = true

    task.negotiator.changeGranted = !task.negotiator.changeGranted
    task.updated = Date.now()
    return await task.save();
}

estimationTaskSchema.statics.approveTaskByNegotiator = async (taskID, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskID)

    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (task.status == SC.STATUS_APPROVED)
        throw new AppError('Task already approved', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id != negotiator._id)
        throw new AppError('You are not a negotiator of estimation this task is part of', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve task into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (task.estimator.changeRequested
        || task.estimator.removalRequested
        || (!task.estimator.estimatedHours || task.estimator.estimatedHours == 0)
        || _.isEmpty(task.estimator.name)
        || _.isEmpty(task.estimator.description))
        throw new AppError('Cannot approve task as either name/description is not not there or there are pending requests from Estimator', EC.INVALID_OPERATION, EC.HTTP_FORBIDDEN)

    task.status = SC.STATUS_APPROVED
    task.updated = Date.now()
    return await task.save();
}


estimationTaskSchema.statics.addTaskFromRepositoryByEstimator = async (taskInput, estimator) => {

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskInput._id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!task.repo && !task.repo._id)
        throw new AppError('Repository task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let repo = await RepositoryModel.findOne({"_id": task.repo._id})
    if (!repo)
        throw new AppError('Repository not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if(!repo.status == SC.STATUS_APPROVED)
        throw new AppError('Repository is not approved/ready to use', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": taskInput.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!estimation._id == task.estimation._id)
        throw new AppError('Task is not this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED,SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can add task from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + "," + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.estimator._id == estimator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let thisTaskWithRepoAlreadyExist = await EstimationTaskModel.findOne({"repo._id":repo._id,"estimation._id":estimation._id})
    if (thisTaskWithRepoAlreadyExist)
        throw new AppError('This task from repository already added', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let taskFromRepositoryObj = new EstimationTaskModel()

    taskFromRepositoryObj.estimator.name = task.estimator.name
    taskFromRepositoryObj.estimator.description = task.estimator.description
    taskFromRepositoryObj.estimator.estimatedHours = task.estimator.estimatedHours

    taskFromRepositoryObj.status = SC.STATUS_PENDING
    taskFromRepositoryObj.addedInThisIteration = true
    taskFromRepositoryObj.owner = SC.OWNER_ESTIMATOR
    taskFromRepositoryObj.initiallyEstimated = true

    taskFromRepositoryObj.estimation = estimation
    taskFromRepositoryObj.nodes = task.notes
    taskFromRepositoryObj.repo = repo
    taskFromRepositoryObj.repo.addedFromThisEstimation = true

    return await EstimationTaskModel.create(taskFromRepositoryObj);
}

estimationTaskSchema.statics.addTaskFromRepositoryByNegotiator = async (taskInput, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let task = await EstimationTaskModel.findById(taskInput._id)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!task.repo && !task.repo._id)
        throw new AppError('Repository task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let repo = await RepositoryModel.findOne({"_id": task.repo._id})
    if (!repo)
        throw new AppError('Repository not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if(!repo.status == SC.STATUS_APPROVED)
        throw new AppError('Repository is not approved/ready to use', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    let estimation = await EstimationModel.findOne({"_id": taskInput.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!estimation._id == task.estimation._id)
        throw new AppError('Task is not this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED,SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can add task from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + "," + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!estimation.negotiator._id == negotiator._id)
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let thisTaskWithRepoAlreadyExist = await EstimationTaskModel.findOne({"repo._id":repo._id,"estimation._id":estimation._id})
    if (thisTaskWithRepoAlreadyExist)
        throw new AppError('This task from repository already added', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let taskFromRepositoryObj = new EstimationTaskModel()

    taskFromRepositoryObj.negotiator.name = task.negotiator.name
    taskFromRepositoryObj.negotiator.description = task.negotiator.description
    taskFromRepositoryObj.negotiator.estimatedHours = task.negotiator.estimatedHours

    taskFromRepositoryObj.status = SC.STATUS_PENDING
    taskFromRepositoryObj.addedInThisIteration = true
    taskFromRepositoryObj.owner = SC.OWNER_NEGOTIATOR
    taskFromRepositoryObj.initiallyEstimated = true

    taskFromRepositoryObj.estimation = estimation
    taskFromRepositoryObj.nodes = task.notes
    taskFromRepositoryObj.repo = repo
    taskFromRepositoryObj.repo.addedFromThisEstimation = true

    return await EstimationTaskModel.create(taskFromRepositoryObj);
}
const EstimationTaskModel = mongoose.model("EstimationTask", estimationTaskSchema)
export default EstimationTaskModel
