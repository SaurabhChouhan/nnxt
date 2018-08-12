import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from "../serverconstants"
import * as V from "../validation"
import {userHasRole} from "../utils"
import * as U from "../utils"
import * as MDL from "../models"
import _ from 'lodash'
import logger from '../logger'

mongoose.Promise = global.Promise

let estimationTaskSchema = mongoose.Schema({
    status: {type: String, enum: [SC.STATUS_APPROVED, SC.STATUS_PENDING], required: true, default: SC.STATUS_PENDING},
    owner: {type: String, enum: [SC.OWNER_ESTIMATOR, SC.OWNER_NEGOTIATOR], required: true},
    addedInThisIteration: {type: Boolean, required: true},
    canApprove: {type: Boolean, default: false},
    hasError: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    created: Date,
    updated: Date,
    type: {
        type: String,
        enum: [SC.TYPE_DEVELOPMENT, SC.TYPE_MANAGEMENT, SC.TYPE_TESTING, SC.TYPE_REVIEW, SC.TYPE_COMPANY]
    },
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
    technologies: [{
        _id: mongoose.Schema.ObjectId,
        name: String
    }],
    tags: [String],
    notes: [{
        name: {type: String, required: true},
        note: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }]
})


estimationTaskSchema.statics.getAllTasksOfEstimation = async (estimationID, user) => {

    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimationID, user)
    if (role === SC.ROLE_ESTIMATOR || role === SC.ROLE_NEGOTIATOR)
        return await EstimationTaskModel.find({"estimation._id": estimationID})

}


// adding task to task model
estimationTaskSchema.statics.addTask = async (taskInput, user, schemaRequested) => {
    if (!taskInput || !taskInput.estimation || !taskInput.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    let role = await MDL.EstimationModel.getUserRoleInEstimation(taskInput.estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationEstimatorAddTaskStruct)
        return await addTaskByEstimator(taskInput, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationNegotiatorAddTaskStruct)
        return await addTaskByNegotiator(taskInput, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// adding task by Estimator
const addTaskByEstimator = async (taskInput, estimator) => {
    V.validate(taskInput, V.estimationEstimatorAddTaskStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await MDL.EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('You are not estimator of this estimation', EC.INVALID_USER, EC.HTTP_FORBIDDEN)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only add task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (taskInput.estimatedHours < 1) {
        throw new AppError("", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST, "estimation.add.atleast1hour")
    }

    taskInput.estimatedHours = U.twoDecimalHours(taskInput.estimatedHours)

    if (taskInput.feature && taskInput.feature._id) {
        // task is part of some feature,
        let estimationFeature = await MDL.EstimationFeatureModel.findById(taskInput.feature._id)
        if (!estimationFeature) {
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }

        if (estimationFeature.estimation._id.toString() !== estimation._id.toString()) {
            throw new AppError('No such feature in this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }

        if (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": estimationFeature._id,
                "estimation._id": estimation._id
            }) > 0
            || _.isEmpty(estimationFeature.estimator.name)
            || _.isEmpty(estimationFeature.estimator.description)
            || !taskInput.estimatedHours
            || taskInput.estimatedHours == 0
            || _.isEmpty(taskInput.name)
            || _.isEmpty(taskInput.description)) {
            // As task is being added into feature estimated hours of task would be added into current estimated hours of feature and with  error has Error become true
            await MDL.EstimationFeatureModel.updateOne({_id: taskInput.feature._id}, {
                $inc: {"estimator.estimatedHours": taskInput.estimatedHours},
                "hasError": true
            })
        } else {
            // As task is being added into feature estimated hours of task would be added into current estimated hours of feature and with no error has Error become false
            await MDL.EstimationFeatureModel.updateOne({_id: taskInput.feature._id}, {
                $inc: {"estimator.estimatedHours": taskInput.estimatedHours},
                "hasError": false
            })
        }
    }

    // Modify estimation
    estimation.estimatedHours += taskInput.estimatedHours
    let idx = estimation.stats.findIndex(s => s.type == taskInput.type)
    if (idx > -1) {
        estimation.stats[idx].estimatedHours += taskInput.estimatedHours
    } else {
        estimation.stats.push({
            estimatedHours: taskInput.estimatedHours,
            type: taskInput.type
        })
    }

    await estimation.save()
    let estimationTask = new EstimationTaskModel()
    estimationTask.estimator.name = taskInput.name
    estimationTask.estimator.description = taskInput.description
    estimationTask.estimator.estimatedHours = taskInput.estimatedHours
    estimationTask.negotiator.estimatedHours = 0
    estimationTask.status = SC.STATUS_PENDING
    estimationTask.type = taskInput.type
    estimationTask.addedInThisIteration = true
    estimationTask.canApprove = false
    estimationTask.hasError = false
    estimationTask.owner = SC.OWNER_ESTIMATOR
    estimationTask.estimation = taskInput.estimation
    estimationTask.technologies = estimation.technologies
    // Add repository reference and also note that this task was added into repository from this estimation
    estimationTask.feature = taskInput.feature
    estimationTask.repo = {}
    //estimationTask.repo._id = repositoryTask._id
    if ((!estimationTask.estimator.estimatedHours || estimationTask.estimator.estimatedHours == 0)
        || _.isEmpty(estimationTask.estimator.name)
        || _.isEmpty(estimationTask.estimator.description)) {
        estimationTask.hasError = true
    } else estimationTask.hasError = false

    estimationTask.repo.addedFromThisEstimation = true

    if (!_.isEmpty(taskInput.notes)) {
        estimationTask.notes = taskInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    return await estimationTask.save()
}

// adding task by Negotiator
const addTaskByNegotiator = async (taskInput, negotiator) => {
    V.validate(taskInput, V.estimationNegotiatorAddTaskStruct)
    let estimationFeatureObj
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not a negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    let estimation = await MDL.EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST, "estimation.notfound")
    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only add task into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (taskInput.estimatedHours < 1) {
        throw new AppError("", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST, "estimation.add.atleast1hour")
    }

    taskInput.estimatedHours = U.twoDecimalHours(taskInput.estimatedHours)

    if (taskInput.feature && taskInput.feature._id) {
        // task is part of some feature,

        estimationFeatureObj = await MDL.EstimationFeatureModel.findById(taskInput.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() !== estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // As task is being added by negotiator there would be any change in estimated hours of feature as this would just be considered as suggestions

        await MDL.EstimationFeatureModel.updateOne({_id: taskInput.feature._id}, {
            $inc: {"negotiator.estimatedHours": taskInput.estimatedHours},
            'hasError': true
        })
    }

    /*
    if (estimation && estimation._id) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {$inc: {"suggestedHours": taskInput.estimatedHours}})
    }
    */

    let canProvideFinalEstimates = false

    // Negotiator can provide final estimates for these types of tasks
    if (_.includes([SC.TYPE_MANAGEMENT, SC.TYPE_TESTING, SC.TYPE_REVIEW], taskInput.type))
        canProvideFinalEstimates = true

    // Modify estimation
    estimation.suggestedHours += taskInput.estimatedHours
    if (canProvideFinalEstimates)
        estimation.estimatedHours += taskInput.estimatedHours


    let idx = estimation.stats.findIndex(s => s.type == taskInput.type)
    console.log("######### IDX ", idx)

    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        if (canProvideFinalEstimates)
            estimation.stats[idx].estimatedHours += taskInput.estimatedHours
    } else {
        // Push new element to stats for keeping details of this type of task
        if (canProvideFinalEstimates)
            estimation.stats.push({
                type: taskInput.type,
                estimatedHours: taskInput.estimatedHours
            })
        else
            estimation.stats.push({
                type: taskInput.type
            })
    }

    await estimation.save()

    let estimationTask = new EstimationTaskModel()
    estimationTask.negotiator.name = taskInput.name
    estimationTask.negotiator.description = taskInput.description
    estimationTask.estimator.name = taskInput.name
    estimationTask.estimator.description = taskInput.description
    estimationTask.negotiator.estimatedHours = taskInput.estimatedHours
    estimationTask.negotiator.changeSuggested = true
    estimationTask.status = SC.STATUS_PENDING
    estimationTask.canApprove = false
    estimationTask.addedInThisIteration = true
    estimationTask.owner = SC.OWNER_NEGOTIATOR
    estimationTask.estimation = taskInput.estimation
    estimationTask.technologies = estimation.technologies
// Add repository reference and also note that this task was added into repository from this estimation
    estimationTask.repo = {}
//estimationTask.repo._id = repositoryTask._id
    estimationTask.repo.addedFromThisEstimation = true
// Add name/description into estimator section as well, estimator can review and add estimated hours against this task
//estimationTask.estimator.name = taskInput.name
// estimationTask.estimator.description = taskInput.description
    estimationTask.feature = taskInput.feature
    if (!_.isEmpty(taskInput.notes)) {
        estimationTask.notes = taskInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    estimationTask.type = taskInput.type
    if (canProvideFinalEstimates) {
        // Tasks of type management are added by Negotiator to estimate management hours that manager would need for this project
        // As negotiator represents Manager, such tasks would directly be in approval stage rather than needing estimated hours
        // from estimator. for this reason, information added here would directly be added to estimator section as well as
        // finally that section is used for copying information
        estimationTask.estimator.name = taskInput.name
        estimationTask.estimator.description = taskInput.description
        estimationTask.estimator.estimatedHours = taskInput.estimatedHours
        estimationTask.hasError = false
        estimationTask.canApprove = true
    }

    await estimationTask.save()
    estimationTask = estimationTask.toObject()
    if (estimation && estimation.canApprove) {
        estimationTask.isEstimationCanApprove = true
    }
    if (estimationFeatureObj && estimationFeatureObj.canApprove) {
        estimationTask.isFeatureCanApprove = true
    }
    return estimationTask
}

// updating task to task model
estimationTaskSchema.statics.updateTask = async (newTaskInput, user, schemaRequested) => {
    let task = await EstimationTaskModel.findById(mongoose.Types.ObjectId(newTaskInput._id))

    if (!task)
        throw new AppError('task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findById(mongoose.Types.ObjectId(task.estimation._id))

    if (!estimation)
        throw new AppError('estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationEstimatorUpdateTaskStruct)
        return await updateTaskByEstimator(newTaskInput, task, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        if (schemaRequested)
            return V.generateSchema(V.estimationNegotiatorUpdateTaskStruct)
        return await updateTaskByNegotiator(newTaskInput, task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// updating task by Estimator
const updateTaskByEstimator = async (newTaskInput, estimationTask, estimation, estimator) => {

    V.validate(newTaskInput, V.estimationEstimatorUpdateTaskStruct)
    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimationTask.status !== SC.STATUS_PENDING) {
        if (estimationTask.owner === SC.OWNER_ESTIMATOR && !estimationTask.addedInThisIteration && !estimationTask.negotiator.changeSuggested && !estimationTask.negotiator.changeGranted) {
            throw new AppError('Not allowed to update task as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        } else if (estimationTask.owner === SC.OWNER_NEGOTIATOR && !estimationTask.negotiator.changeSuggested && !estimationTask.negotiator.changeGranted) {
            throw new AppError('Not allowed to update task as Negotiator has not granted permission', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        }
    }

    if (newTaskInput.estimatedHours < 1) {
        throw new AppError("Estimated hours should be at least 1", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    }

    newTaskInput.estimatedHours = U.twoDecimalHours(newTaskInput.estimatedHours)

    if (!estimationTask.negotiator.estimatedHours) {
        estimationTask.negotiator.estimatedHours = 0
    }
    if (!estimationTask.estimator.estimatedHours) {
        estimationTask.estimator.estimatedHours = 0
    }

    if (estimator._id.toString() !== estimation.estimator._id.toString())
        throw new AppError('Invalid task for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (newTaskInput.repo && !newTaskInput.repo.addedFromThisEstimation)
        throw new AppError('Task is From Repository ', EC.TASK_FROM_REPOSITORY_ERROR)

    if (newTaskInput.estimatedHours < 1) {
        throw new AppError("", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST, "estimation.add.atleast1hour")
    }

    if (estimationTask.feature && estimationTask.feature._id) {
        let estimationFeatureObj = await MDL.EstimationFeatureModel.findById(estimationTask.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() !== estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if ((await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": estimationFeatureObj._id,
                "estimation._id": estimation._id
            }) + (estimationTask.hasError ? -1 : 0)) > 0
            || !newTaskInput.estimatedHours
            || newTaskInput.estimatedHours == 0
            || _.isEmpty(newTaskInput.name)
            || _.isEmpty(newTaskInput.description)
            || _.isEmpty(estimationFeatureObj.estimator.name)
            || _.isEmpty(estimationFeatureObj.estimator.description)
            || ((estimationFeatureObj.estimator.estimatedHours ? estimationFeatureObj.estimator.estimatedHours : 0) - (estimationTask.estimator.estimatedHours ? estimationTask.estimator.estimatedHours : 0) + (newTaskInput.estimatedHours ? newTaskInput.estimatedHours : 0)) <= 0) {

            await MDL.EstimationFeatureModel.updateOne({_id: estimationTask.feature._id}, {
                $inc: {"estimator.estimatedHours": estimationTask.estimator.estimatedHours ? (newTaskInput.estimatedHours - estimationTask.estimator.estimatedHours) : newTaskInput.estimatedHours},
                "canApprove": false,
                "estimator.changedInThisIteration": true,
                "hasError": true
            })
        } else {
            await MDL.EstimationFeatureModel.updateOne({_id: estimationTask.feature._id}, {
                $inc: {"estimator.estimatedHours": estimationTask.estimator.estimatedHours ? (estimationTask.estimator.estimatedHours - estimationTask.estimator.estimatedHours) : newTaskInput.estimatedHours},
                "canApprove": false,
                "estimator.changedInThisIteration": true,
                "hasError": false
            })
        }
    }

    let diffHours = estimationTask.estimator.estimatedHours ? newTaskInput.estimatedHours - estimationTask.estimator.estimatedHours : newTaskInput.estimatedHours

    // Modify estimation
    estimation.estimatedHours += diffHours

    let idx = estimation.stats.findIndex(s => s.type === estimationTask.type)
    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        estimation.stats[idx].estimatedHours += diffHours
    } else {
        throw new AppError('In update task we should have find index value of type ', EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)
    }

    await estimation.save()

    if (estimationTask.repo && estimationTask.repo._id) {
        // find repo and update when task is updating
        let repositoryTask = await
            MDL.RepositoryModel.updateTask(estimationTask.repo._id, newTaskInput, estimator)
    }

    estimationTask.feature = newTaskInput.feature ? newTaskInput.feature : estimationTask.feature ? estimationTask.feature : undefined
    estimationTask.estimator.name = newTaskInput.name
    estimationTask.estimator.description = newTaskInput.description
    estimationTask.estimator.estimatedHours = newTaskInput.estimatedHours
    estimationTask.canApprove = false
    estimationTask.hasError = false

    if ((!estimationTask.estimator.estimatedHours || estimationTask.estimator.estimatedHours == 0)
        || _.isEmpty(estimationTask.estimator.name)
        || _.isEmpty(estimationTask.estimator.description)) {
        estimationTask.hasError = true
    } else estimationTask.hasError = false

    if (!estimationTask.addedInThisIteration || estimationTask.owner !== SC.OWNER_ESTIMATOR) {
        estimationTask.estimator.changedInThisIteration = true
        estimationTask.estimator.changedKeyInformation = true
    }

    estimationTask.updated = Date.now()

    if (!_.isEmpty(newTaskInput.notes)) {
        newTaskInput.notes = newTaskInput.notes.map(n => {
            n.name = estimator.fullName
            return n
        })
    }

    let mergeAllNotes = []
    if (!_.isEmpty(estimationTask.notes)) {
        mergeAllNotes = estimationTask.notes
        newTaskInput.notes.map(n => {
            mergeAllNotes.push(n)
        })
    } else {
        mergeAllNotes = newTaskInput.notes
    }
    estimationTask.notes = mergeAllNotes
    return await estimationTask.save()

}

// updating task by Negotiator
const updateTaskByNegotiator = async (newTaskInput, estimationTask, estimation, negotiator) => {
    V.validate(newTaskInput, V.estimationNegotiatorUpdateTaskStruct)
    let estimationFeatureObj
    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (negotiator._id.toString() !== estimation.negotiator._id.toString())
        throw new AppError('Invalid task for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (newTaskInput.repo && !newTaskInput.repo.addedFromThisEstimation)
        throw new AppError('Task is From Repository ', EC.TASK_FROM_REPOSITORY_ERROR)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only update task into those estimations where status is in [" + SC.STATUS_INITIATED + "," + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (newTaskInput.estimatedHours < 1) {
        throw new AppError("", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST, "estimation.add.atleast1hour")
    }

    newTaskInput.estimatedHours = U.twoDecimalHours(newTaskInput.estimatedHours)

    if (estimationTask.feature && estimationTask.feature._id) {
        estimationFeatureObj = await MDL.EstimationFeatureModel.findById(mongoose.Types.ObjectId(estimationTask.feature._id))
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() !== estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        let canApprove = false

        if (estimationTask.estimator.name && estimationTask.estimator.description && estimationTask.estimator.estimatedHours) {
            // estimation already have all the required information so negotiator can approve task even if he has updated it
            // eventually name/description in estimation section would be used and hence estimator should not have any problem
            canApprove = true

        }

        await MDL.EstimationFeatureModel.updateOne({_id: estimationTask.feature._id}, {
            $inc: {"negotiator.estimatedHours": estimationTask.negotiator.estimatedHours ? newTaskInput.estimatedHours - estimationTask.negotiator.estimatedHours : newTaskInput.estimatedHours},
            "canApprove": canApprove,
            "negotiator.changedInThisIteration": true
        })
    }
    if (estimation && estimation._id) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {
            $inc: {"suggestedHours": estimationTask.negotiator.estimatedHours ? newTaskInput.estimatedHours - estimationTask.negotiator.estimatedHours : newTaskInput.estimatedHours}
        })
    }

    let canProvideFinalEstimates = false
    // Negotiator can provide final estimates for these types of tasks
    if (_.includes([SC.TYPE_MANAGEMENT, SC.TYPE_TESTING, SC.TYPE_REVIEW], newTaskInput.type))
        canProvideFinalEstimates = true

    let diffHours = estimationTask.negotiator.estimatedHours ? newTaskInput.estimatedHours - estimationTask.negotiator.estimatedHours : newTaskInput.estimatedHours

    // Modify estimation
    estimation.suggestedHours += diffHours

    if (canProvideFinalEstimates)
        estimation.estimatedHours += diffHours

    let idx = estimation.stats.findIndex(s => s.type === newTaskInput.type)
    if (idx > -1) {
        // In case of following task type, negotiators hours are considered as estimated hours of final estimation
        if (canProvideFinalEstimates)
            estimation.stats[idx].estimatedHours += diffHours
    } else {
        // Push new element to stats for keeping details of this type of task
        if (canProvideFinalEstimates)
            estimation.stats.push({
                type: newTaskInput.type,
                estimatedHours: diffHours
            })
        else
            estimation.stats.push({
                type: newTaskInput.type
            })
    }

    await estimation.save()


    estimationTask.feature = newTaskInput.feature ? newTaskInput.feature : estimationTask.feature ? estimationTask.feature : undefined
    estimationTask.negotiator.name = newTaskInput.name

    if (estimationTask.estimator.name && estimationTask.estimator.description && estimationTask.estimator.estimatedHours)
        estimationTask.canApprove = true
    else
        estimationTask.canApprove = false

    estimationTask.negotiator.description = newTaskInput.description
    estimationTask.negotiator.estimatedHours = newTaskInput.estimatedHours

    if (!estimationTask.addedInThisIteration || estimationTask.owner !== SC.OWNER_NEGOTIATOR)
        estimationTask.negotiator.changedInThisIteration = true
    estimationTask.negotiator.changeSuggested = true
    if (!estimationTask.estimator.estimatedHours) {
        estimationTask.estimator.estimatedHours = 0
    }
    estimationTask.updated = Date.now()

    if (!_.isEmpty(newTaskInput.notes)) {
        newTaskInput.notes = newTaskInput.notes.map(n => {
            n.name = negotiator.fullName
            return n
        })
    }

    let mergeAllNotes = []
    if (!_.isEmpty(estimationTask.notes)) {
        mergeAllNotes = estimationTask.notes
        newTaskInput.notes.map(n => {
            mergeAllNotes.push(n)
        })
    } else {
        mergeAllNotes = newTaskInput.notes
    }
    estimationTask.notes = mergeAllNotes

    /*
    Task of type other than 'development' can be approved directly by Negotiator is he has created those tasks so in that
    creation
    */
    if (canProvideFinalEstimates && estimationTask.owner === SC.OWNER_NEGOTIATOR) {
        estimationTask.estimator.name = newTaskInput.name
        estimationTask.estimator.description = newTaskInput.description
        estimationTask.estimator.estimatedHours = newTaskInput.estimatedHours
        estimationTask.hasError = false
        estimationTask.canApprove = true
    }

    await estimationTask.save()
    estimationTask = estimationTask.toObject()
    if (estimationFeatureObj && estimationFeatureObj.canApprove) {
        estimationTask.isFeatureCanApprove = true
    }
    if (estimation && estimation.canApprove) {
        estimationTask.isEstimationCanApprove = true
    }
    return estimationTask
}

// move task to feature
estimationTaskSchema.statics.moveTaskToFeature = async (taskID, featureID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let feature = await MDL.EstimationFeatureModel.findById(featureID)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": feature.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(task.estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        return await moveTaskToFeatureByEstimator(task, feature, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {

        return await moveTaskToFeatureByNegotiator(task, feature, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// move task to feature by Estimator
const moveTaskToFeatureByEstimator = async (task, feature, estimation, estimator) => {


    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only move task to feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (feature.status === SC.STATUS_APPROVED) {
        throw new AppError('Task can not be moved as feature is already approved', EC.MOVE_TASK_IN_FEATURE_ERROR, EC.HTTP_BAD_REQUEST)
    }
    // As task is being moved to feature, estimated hours and suggested hours of this task would be added into estimated hours of feature (only if estimator.estimatedHours has value

    if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
        // As task is moved we have to check for has error in feature including this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? +1 : 0)) > 0) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": task.estimator.estimatedHours,
                    "negotiator.estimatedHours": task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": true
            })

        } else {
            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": task.estimator.estimatedHours,
                    "negotiator.estimatedHours": task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": false
            })
        }

    } else if (task.estimator.estimatedHours) {
        //only estimated hours is there in this task
        // As task is included we have to check for has error in feature including this task
        if ((!feature.estimator.name
                || _.isEmpty(feature.estimator.name)
                || !feature.estimator.description
                || _.isEmpty(feature.estimator.description)

                || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
                || (await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? +1 : 0)) > 0)) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }


    } else if (task.negotiator.estimatedHours) {

        //only suggested hours is there in this task
        // As task is included we have to check for has error in feature including this task
        if ((!feature.estimator.name
                || _.isEmpty(feature.estimator.name)
                || !feature.estimator.description
                || _.isEmpty(feature.estimator.description)

                || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
                || (await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? +1 : 0)) > 0)) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }

    } else {
        await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
            "canApprove": false,
            "hasError": true
        })
    }

    // As task is moved do not update repository to note this change

    // moved out by negotiator then clear its flag while move in to feature by estimator
    if (task.negotiator.isMovedOutOfFeature && task.negotiator.changedInThisIteration) {
        task.negotiator.isMovedOutOfFeature = false
        task.negotiator.changedInThisIteration = false
    }
    task.feature = feature
    task.canApprove = false
    task.updated = Date.now()
    if (!task.addedInThisIteration || task.owner !== SC.OWNER_ESTIMATOR)
        task.estimator.changedInThisIteration = true
    task.estimator.isMovedToFeature = true
    task.estimator.isMovedOutOfFeature = false
    return await task.save()
}


// move task to feature by Negotiator
const moveTaskToFeatureByNegotiator = async (task, feature, estimation, negotiator) => {

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only move task to feature into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)


    if (feature.status === SC.STATUS_APPROVED) {
        throw new AppError('task cant be moved as it is already approved', EC.MOVE_TASK_IN_FEATURE_ERROR, EC.HTTP_BAD_REQUEST)
    }
    // As task is being moved to feature, estimated hours of this task would be added into estimated hours of feature (only if estimator.estimatedHours has value


    if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
        // As task is moved we have to check for has error in feature including this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? +1 : 0)) > 0) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": task.estimator.estimatedHours,
                    "negotiator.estimatedHours": task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": true
            })

        } else {
            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": task.estimator.estimatedHours,
                    "negotiator.estimatedHours": task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": false
            })
        }

    } else if (task.estimator.estimatedHours) {
        //only estimated hours is there in this task
        // As task is included we have to check for has error in feature including this task
        if ((!feature.estimator.name
                || _.isEmpty(feature.estimator.name)
                || !feature.estimator.description
                || _.isEmpty(feature.estimator.description)

                || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
                || (await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? +1 : 0)) > 0)) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }


    } else if (task.negotiator.estimatedHours) {

        //only suggested hours is there in this task
        // As task is included we have to check for has error in feature including this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours + task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? +1 : 0)) > 0) {

            //there is still error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after including this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }

    } else {
        await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
            "canApprove": false,
            "hasError": true
        })
    }
    // moved out by estimator then clear its flag while move in to feature by negotiator
    if (task.estimator.isMovedOutOfFeature && task.estimator.changedInThisIteration) {
        task.estimator.isMovedOutOfFeature = false
        task.estimator.changedInThisIteration = false
    }
    task.feature = feature
    task.updated = Date.now()
    if (!task.addedInThisIteration || task.owner !== SC.OWNER_NEGOTIATOR)
        task.negotiator.changedInThisIteration = true
    task.negotiator.isMovedToFeature = true
    task.negotiator.isMovedOutOfFeature = false
    return await task.save()
}


// move task out of feature
estimationTaskSchema.statics.moveTaskOutOfFeature = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(task.estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        return await moveTaskOutOfFeatureByEstimator(task, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {

        return await moveTaskOutOfFeatureByNegotiator(task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// move task out of feature by estimator
const moveTaskOutOfFeatureByEstimator = async (task, estimation, estimator) => {

    let feature = await MDL.EstimationFeatureModel.findById(task.feature._id)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update feature(Move task out of Feature) into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)


    // As task is moved out of feature we would have to subtract hours ($inc with minus) of this task from overall estimated hours of feature

    if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
        // As task is moved out of feature we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {

            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": -task.estimator.estimatedHours,
                    "negotiator.estimatedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": true
            })

        } else {

            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": -task.estimator.estimatedHours,
                    "negotiator.estimatedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": false
            })
        }

    } else if (task.estimator.estimatedHours) {
        //only estimated hours is there in this task
        // As task is excluded we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {

            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }


    } else if (task.negotiator.estimatedHours) {

        //only suggested hours is there in this task
        // As task is excluded we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {


            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {


            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }

    } else {
        await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
            "canApprove": false,
            "hasError": true
        })
    }

    // moved in by negotiator  then clear its flag while move out to feature by estimator
    if (task.negotiator.isMovedToFeature && task.negotiator.changedInThisIteration) {
        task.negotiator.isMovedToFeature = false
        task.negotiator.changedInThisIteration = false
    }
    task.feature = null
    task.updated = Date.now()
    task.estimator.isMovedToFeature = false
    task.estimator.isMovedOutOfFeature = true
    if (!task.addedInThisIteration || task.owner !== SC.OWNER_ESTIMATOR)
        task.estimator.changedInThisIteration = true
    return await task.save()
}

// move task out of feature by negotiator
const moveTaskOutOfFeatureByNegotiator = async (task, estimation, negotiator) => {

    let feature = await MDL.EstimationFeatureModel.findById(task.feature._id)
    if (!feature)
        throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only update feature(Move task out of feature) into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    // As task is moved out of feature we would have to subtract hours ($inc with minus) of this task from overall estimated hours of feature


    if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
        // As task is moved out of feature we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {

            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": -task.estimator.estimatedHours,
                    "negotiator.estimatedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": true
            })

        } else {

            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {
                    "estimator.estimatedHours": -task.estimator.estimatedHours,
                    "negotiator.estimatedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false,
                "hasError": false
            })
        }

    } else if (task.estimator.estimatedHours) {
        //only estimated hours is there in this task
        // As task is excluded we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {

            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }


    } else if (task.negotiator.estimatedHours) {

        //only suggested hours is there in this task
        // As task is excluded we have to check for has error in feature excluding this task
        if (!feature.estimator.name
            || _.isEmpty(feature.estimator.name)
            || !feature.estimator.description
            || _.isEmpty(feature.estimator.description)

            || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0
            || (await EstimationTaskModel.count({
                "hasError": true,
                "isDeleted": false,
                "feature._id": feature._id,
                "estimation._id": estimation._id
            }) + (task.hasError ? -1 : 0)) > 0) {


            //there is still error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": true
            })
        } else {

            //there is no error after excluding this task
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                "canApprove": false,
                "hasError": false
            })
        }

    } else {
        await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
            "canApprove": false,
            "hasError": true
        })
    }


    // moved in by estimator then clear its flag while move out to feature by negotiator
    if (task.estimator.isMovedToFeature && task.estimator.changedInThisIteration) {
        task.estimator.isMovedToFeature = false
        task.estimator.changedInThisIteration = false
    }

    task.feature = null
    task.updated = Date.now()
    task.negotiator.isMovedToFeature = false
    task.negotiator.isMovedOutOfFeature = true
    if (!task.addedInThisIteration || task.owner !== SC.OWNER_NEGOTIATOR)
        task.negotiator.changedInThisIteration = true
    return await task.save()
}


// request removal task
estimationTaskSchema.statics.requestRemovalTask = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        return await requestRemovalTaskByEstimator(task, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "] can request removal task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// request removal task by estimator
const requestRemovalTaskByEstimator = async (task, estimation, estimator) => {

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only update removal task flag into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (task && task.feature && task.feature._id) {
        await MDL.EstimationFeatureModel.updateOne({_id: task.feature._id}, {
            $set: {"estimator.requestedInThisIteration": true}
        })
    }

    task.estimator.removalRequested = !task.estimator.removalRequested
    task.estimator.changedInThisIteration = true

    return await task.save()
}

// request re-open task
estimationTaskSchema.statics.requestReOpenPermissionOfTask = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        return await requestReOpenPermissionOfTaskByEstimator(task, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "] can request re-open task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// request re-open task by estimator
const requestReOpenPermissionOfTaskByEstimator = async (task, estimation, estimator) => {

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can only request edit task into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (task && task.feature && task.feature._id) {
        await MDL.EstimationFeatureModel.updateOne({_id: task.feature._id}, {
            $set: {"estimator.requestedInThisIteration": true},
            "canApprove": false
        })
    }

    task.estimator.changeRequested = !task.estimator.changeRequested
    task.estimator.changedInThisIteration = true
    task.canApprove = false

    return await task.save()
}

// delete task
estimationTaskSchema.statics.deleteTask = async (taskID, estimationID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": estimationID})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {

        return await deleteTaskByEstimator(task, estimation, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await deleteTaskByNegotiator(task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// delete task by estimator
const deleteTaskByEstimator = async (task, estimation, estimator) => {

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!task.addedInThisIteration)
        throw new AppError('You are not allowed to delete this task', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)

    if (task.feature && task.feature._id) {
        let feature = await MDL.EstimationFeatureModel.findById(task.feature._id)
        if (!feature)
            throw new AppError('Feature that this task is associated with is not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        // As task is removed we have to subtract hours ($inc with minus) of this task from overall estimated hours of feature

        if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
            // As task is removed we have to check for has error in feature except deleting task
            if ((await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? -1 : 0)) > 0
                || _.isEmpty(feature.estimator.name)
                || _.isEmpty(feature.estimator.description)
                || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {
                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {
                        "estimator.estimatedHours": -task.estimator.estimatedHours,
                        "negotiator.estimatedHours": -task.negotiator.estimatedHours
                    },
                    "canApprove": false,
                    "hasError": true
                })

            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {
                        "estimator.estimatedHours": -task.estimator.estimatedHours,
                        "negotiator.estimatedHours": -task.negotiator.estimatedHours
                    },
                    "canApprove": false,
                    "hasError": false
                })
            }

        } else if (task.estimator.estimatedHours) {
            //only estimated hours is there in this task
            // As task is removed we have to check for has error in feature except deleting task
            if ((await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? -1 : 0)) > 0
                || _.isEmpty(feature.estimator.name)
                || _.isEmpty(feature.estimator.description)
                || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {
                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                    "canApprove": false,
                    "hasError": true
                })
            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                    "canApprove": false,
                    "hasError": false
                })
            }


        } else if (task.negotiator.estimatedHours) {

            //only suggested hours is there in this task
            // As task is removed we have to check for has error in feature except deleting task
            if ((await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? -1 : 0)) > 0
                || _.isEmpty(feature.estimator.name)
                || _.isEmpty(feature.estimator.description)
                || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {

                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                    "canApprove": false,
                    "hasError": true
                })
            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                    "canApprove": false,
                    "hasError": false
                })
            }

        }
    }

    if (estimation && estimation._id) {
        // As task is removed we have to subtract hours ($inc with minus) of this task from overall estimated hours and suggested hours of estimation

        if (task.negotiator.estimatedHours && task.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {
                    "estimatedHours": -task.estimator.estimatedHours,
                    "suggestedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false
            })

        } else if (task.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false
            })
        } else if (task.negotiator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: feature._id}, {
                $inc: {"suggestedHours": -task.negotiator.estimatedHours},
                "canApprove": false
            })
        }

    }
    task.isDeleted = true
    task.estimator.changedInThisIteration = true
    task.updated = Date.now()
    return await task.save()
}


// delete task by negotiator
const deleteTaskByNegotiator = async (task, estimation, negotiator) => {


    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)


    if (task.feature && task.feature._id) {
        let feature = await MDL.EstimationFeatureModel.findById(task.feature._id)
        if (!feature)
            throw new AppError('Feature that this task is associated with is not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (task.estimator.estimatedHours && task.negotiator.estimatedHours) {
            // As task is removed we have to check for has error in feature except deleting task
            if ((await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? -1 : 0)) > 0
                || _.isEmpty(feature.estimator.name)
                || _.isEmpty(feature.estimator.description)
                || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {
                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {
                        "estimator.estimatedHours": -task.estimator.estimatedHours,
                        "negotiator.estimatedHours": -task.negotiator.estimatedHours
                    },
                    "canApprove": false,
                    "hasError": true
                })

            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {
                        "estimator.estimatedHours": -task.estimator.estimatedHours,
                        "negotiator.estimatedHours": -task.negotiator.estimatedHours
                    },
                    "canApprove": false,
                    "hasError": false
                })
            }

        } else if (task.estimator.estimatedHours) {
            //only estimated hours is there in this task
            // As task is removed we have to check for has error in feature except deleting task
            if ((await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + (task.hasError ? -1 : 0)) > 0
                || _.isEmpty(feature.estimator.name)
                || _.isEmpty(feature.estimator.description)
                || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {
                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                    "canApprove": false,
                    "hasError": true
                })
            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"estimator.estimatedHours": -task.estimator.estimatedHours},
                    "canApprove": false,
                    "hasError": false
                })
            }


        } else if (task.negotiator.estimatedHours) {

            //only suggested hours is there in this task
            // As task is removed we have to check for has error in feature except deleting task
            if (await EstimationTaskModel.count({
                    "hasError": true,
                    "isDeleted": false,
                    "feature._id": feature._id,
                    "estimation._id": estimation._id
                }) + task.hasError ? -1 : 0 > 0
                    || _.isEmpty(feature.estimator.name)
                    || _.isEmpty(feature.estimator.description)
                    || (feature.estimator.estimatedHours - task.estimator.estimatedHours) <= 0) {

                //there is still error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                    "canApprove": false,
                    "hasError": true
                })
            } else {
                //there is no error after deleting this task
                await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                    $inc: {"negotiator.estimatedHours": -task.negotiator.estimatedHours},
                    "canApprove": false,
                    "hasError": false
                })
            }

        }

        if ((task.estimator.removalRequested || task.estimator.changeRequested) && (
                await EstimationTaskModel.count({
                    "feature._id": feature._id,
                    "isDeleted": false,
                    "estimator.removalRequested": true
                }) + await EstimationTaskModel.count({
                    "feature._id": feature._id,
                    "isDeleted": false,
                    "estimator.changeRequested": true
                })) <= 1) {
            await MDL.EstimationFeatureModel.updateOne({_id: feature._id}, {
                $set: {"estimator.requestedInThisIteration": false}
            })
        }


    }
    if (estimation && estimation._id) {
        // As task is removed we have to subtract hours ($inc with minus) of this task from overall estimated hours and suggested hours of estimation

        if (task.negotiator.estimatedHours && task.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {
                    "estimatedHours": -task.estimator.estimatedHours,
                    "suggestedHours": -task.negotiator.estimatedHours
                },
                "canApprove": false
            })

        } else if (task.estimator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"estimatedHours": -task.estimator.estimatedHours},
                "canApprove": false
            })
        } else if (task.negotiator.estimatedHours) {
            await MDL.EstimationModel.updateOne({_id: estimation._id}, {
                $inc: {"suggestedHours": -task.negotiator.estimatedHours},
                "canApprove": false
            })
        }

    }
    task.isDeleted = true
    task.negotiator.changedInThisIteration = true
    task.updated = Date.now()
    return await task.save()
}


// grant reOpen permission of task
estimationTaskSchema.statics.grantReOpenPermissionOfTask = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can grant reopen permission of task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await grantReOpenPermissionOfTaskByNegotiator(task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// grant reOpen permission of task by negotiator
const grantReOpenPermissionOfTaskByNegotiator = async (task, estimation, negotiator) => {

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only given grant edit permission to task into those estimations where status is in [" + SC.STATUS_INITIATED + ", " + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (!task.addedInThisIteration)
        task.negotiator.changedInThisIteration = true

    let estimationFeatureObj
    if (task.feature && task.feature._id) {
        if ((
                await EstimationTaskModel.count({
                    "feature._id": task.feature._id,
                    "isDeleted": false,
                    "estimator.removalRequested": true
                })
                + await EstimationTaskModel.count({
                    "feature._id": task.feature._id,
                    "isDeleted": false,
                    "estimator.changeRequested": true
                })
            ) <= 1) {
            await MDL.EstimationFeatureModel.updateOne({_id: task.feature._id}, {
                $set: {"estimator.requestedInThisIteration": false}
            })
        }
        estimationFeatureObj = await MDL.EstimationFeatureModel.findById(task.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        if (estimation._id.toString() !== estimationFeatureObj.estimation._id.toString())
            throw new AppError('Feature not found for this estimation', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        await MDL.EstimationFeatureModel.updateOne({"_id": task.feature._id}, {
            "status": SC.STATUS_PENDING,
            "canApprove": false
        })
    }

    task.negotiator.changeGranted = !task.negotiator.changeGranted
    task.canApprove = true // even though negotiator granted permission it can still change his mind and approve task
    task.status = SC.STATUS_PENDING
    task.updated = Date.now()
    await task.save()

    task = task.toObject()
    if (estimation && estimation.canApprove) {
        task.isEstimationCanApprove = true
    }
    return task
}


// approve task
estimationTaskSchema.statics.approveTask = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(taskID)
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await approveTaskByNegotiator(task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


const approveTaskByNegotiator = async (task, estimation, negotiator) => {
    let canApprove = true

    if (estimation.status === SC.STATUS_INITIATED) {
        if (estimation.type === SC.TYPE_DEVELOPMENT)
            canApprove = false;
    } else if (estimation.status !== SC.STATUS_REVIEW_REQUESTED)
        canApprove = false

    if (!canApprove)
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can only approve task only when estimation status is [" + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_STAGE_OPERATION, EC.HTTP_BAD_REQUEST)

    if (!(task.canApprove))
        throw new AppError('Cannot approve task as either name/description is not not there or there are pending requests from Estimator', EC.TASK_APPROVAL_ERROR, EC.HTTP_FORBIDDEN)


    if (task.negotiator.estimatedHours == 0) {
        if (estimation && estimation._id) {
            await MDL.EstimationModel.updateOne({"_id": estimation._id}, {
                $inc: {
                    "suggestedHours": task.estimator.estimatedHours
                }
            })
        }

        if (task.feature && task.feature._id) {
            await MDL.EstimationFeatureModel.updateOne({"_id": task.feature._id}, {
                $inc: {
                    "negotiator.estimatedHours": task.estimator.estimatedHours
                },
            })
        }
    }


    task.negotiator.name = task.estimator.name
    task.negotiator.description = task.estimator.description

    if (task.negotiator.estimatedHours == 0)
        task.negotiator.estimatedHours = task.estimator.estimatedHours

    //task.negotiator.changeSuggested = false
    task.negotiator.changeGranted = false
    task.negotiator.changedInThisIteration = true
    //task.negotiator.changedInThisIteration = false
    //task.negotiator.isMovedToFeature = false
    //task.negotiator.isMovedOutOfFeature = false
    //task.estimator.changeRequested = false
    //task.estimator.changedKeyInformation = false
    //task.estimator.removalRequested = false
    //task.estimator.changedInThisIteration = false
    //task.estimator.isMovedToFeature = false
    //task.estimator.isMovedOutOfFeature = false
    task.status = SC.STATUS_APPROVED
    task.canApprove = false
    task.updated = Date.now()
    return await task.save()
}

// add task from repo
estimationTaskSchema.statics.addTaskFromRepository = async (estimationID, repositoryTaskID, user) => {

    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimationID, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await addTaskFromRepositoryByEstimator(estimationID, repositoryTaskID, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await addTaskFromRepositoryByNegotiator(estimationID, repositoryTaskID, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

const addTaskFromRepositoryByEstimator = async (estimationID, repositoryTaskID, estimator) => {

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryTask = await MDL.RepositoryModel.findById(repositoryTaskID)
    if (!repositoryTask)
        throw new AppError('Task not found in repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (repositoryTask.isFeature)
        throw new AppError('This is not a task but a feature', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /*
    TODO: Need to uncomment this once repository approve functionality is in place
    if (!_.includes([SC.STATUS_APPROVED], repositoryTask.status))
        throw new AppError('This repository task is not yet approved so cannot be added to this estimation', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        */

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can add task from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + "," + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let thisTaskWithRepoAlreadyExist = await EstimationTaskModel.findOne({
        "repo._id": repositoryTask._id,
        "isDeleted": false,
        "estimation._id": estimation._id
    })
    if (thisTaskWithRepoAlreadyExist)
        throw new AppError('This task is already part of estimation', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    if (estimation && estimation._id && repositoryTask.estimatedHours && repositoryTask.estimatedHours > 0) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {
            $inc: {"estimatedHours": repositoryTask.estimatedHours}
        })
    }

    let estimationTask = new EstimationTaskModel()
    // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
    estimationTask.estimator.name = repositoryTask.name
    estimationTask.estimator.description = repositoryTask.description
    estimationTask.estimator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
    estimationTask.negotiator.name = repositoryTask.name
    estimationTask.negotiator.description = repositoryTask.description
    estimationTask.negotiator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
    estimationTask.status = SC.STATUS_PENDING
    estimationTask.addedInThisIteration = true
    estimationTask.canApprove = false
    estimationTask.owner = SC.OWNER_ESTIMATOR
    estimationTask.estimation = estimation
    estimationTask.technologies = estimation.technologies
    estimationTask.repo = {}
    estimationTask.repo._id = repositoryTask._id
    estimationTask.repo.addedFromThisEstimation = false
    estimationTask.type = SC.TYPE_DEVELOPMENT

    //conditions for has error
    if (!repositoryTask.name
        || _.isEmpty(repositoryTask.name)
        || !repositoryTask.description
        || _.isEmpty(repositoryTask.description)
        || !repositoryTask.estimatedHours
        || repositoryTask.estimatedHours == 0) {
        estimationTask.hasError = true
    } else estimationTask.hasError = false


    await estimationTask.save()

    estimationTask = estimationTask.toObject()
    if (estimation && estimation.canApprove) {
        estimationTask.isEstimationCanApprove = true
    }
    return estimationTask

}


const addTaskFromRepositoryByNegotiator = async (estimationID, repositoryTaskID, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryTask = await MDL.RepositoryModel.findById(repositoryTaskID)
    if (!repositoryTask)
        throw new AppError('Task not found in repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     TODO: Need to uncomment code once we have repository task approval feature in place
     if (!_.includes([SC.STATUS_APPROVED], repositoryTask.status))
     throw new AppError('This repository task is not yet approved so cannot be added to this estimation', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (repositoryTask.isFeature)
        throw new AppError('This is not a task but a feature', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can add task from repository into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + "," + SC.STATUS_INITIATED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not a Negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let checkExistsCount = await EstimationTaskModel.count({
        "repo._id": repositoryTask._id,
        "isDeleted": false,
        "estimation._id": estimation._id
    })
    if (checkExistsCount > 0)
        throw new AppError('This task from repository already added', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    if (estimation && estimation._id && repositoryTask.estimatedHours && repositoryTask.estimatedHours > 0) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {
            $inc: {"estimatedHours": repositoryTask.estimatedHours}
        })
    }
    // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
    let taskFromRepositoryObj = new EstimationTaskModel()
    taskFromRepositoryObj.estimator.name = repositoryTask.name
    taskFromRepositoryObj.estimator.description = repositoryTask.description
    taskFromRepositoryObj.estimator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
    taskFromRepositoryObj.negotiator.name = repositoryTask.name
    taskFromRepositoryObj.negotiator.description = repositoryTask.description
    taskFromRepositoryObj.negotiator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
    taskFromRepositoryObj.status = SC.STATUS_PENDING
    taskFromRepositoryObj.addedInThisIteration = true
    taskFromRepositoryObj.canApprove = false
    taskFromRepositoryObj.owner = SC.OWNER_NEGOTIATOR
    taskFromRepositoryObj.type = SC.TYPE_DEVELOPMENT

    //conditions for has error
    if (!repositoryTask.name
        || _.isEmpty(repositoryTask.name)
        || !repositoryTask.description
        || _.isEmpty(repositoryTask.description)
        || !repositoryTask.estimatedHours
        || repositoryTask.estimatedHours == 0) {
        taskFromRepositoryObj.hasError = true
    } else taskFromRepositoryObj.hasError = false

    taskFromRepositoryObj.estimation = estimation
    taskFromRepositoryObj.technologies = estimation.technologies
    taskFromRepositoryObj.repo = {}
    taskFromRepositoryObj.repo._id = repositoryTask._id
    taskFromRepositoryObj.repo.addedFromThisEstimation = false
    let taskFromRepo = await EstimationTaskModel.create(taskFromRepositoryObj)
    taskFromRepo = taskFromRepo.toObject()
    if (estimation && estimation.canApprove) {
        taskFromRepo.isEstimationCanApprove = true
    }
    return taskFromRepo
}


// copy task from repo
estimationTaskSchema.statics.copyTaskFromRepository = async (estimationID, repositoryTaskID, user) => {

    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimationID, user)
    if (role === SC.ROLE_ESTIMATOR) {
        return await copyTaskFromRepositoryByEstimator(estimationID, repositoryTaskID, user)
    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await copyTaskFromRepositoryByNegotiator(estimationID, repositoryTaskID, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}

// copy task from repo by estimator
const copyTaskFromRepositoryByEstimator = async (estimationID, repositoryTaskID, estimator) => {

    if (!estimator || !userHasRole(estimator, SC.ROLE_ESTIMATOR))
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryTask = await MDL.RepositoryModel.findById(repositoryTaskID)
    if (!repositoryTask)
        throw new AppError('Task not found in repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (repositoryTask.isFeature)
        throw new AppError('This is not a task but a feature', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /*
    TODO: Need to uncomment this once repository approve functionality is in place
    if (!_.includes([SC.STATUS_APPROVED], repositoryTask.status))
        throw new AppError('This repository task is not yet approved so cannot be added to this estimation', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
        */

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Estimator can add task from repository into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + "," + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.estimator._id.toString() !== estimator._id.toString())
        throw new AppError('Not an estimator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation && estimation._id && repositoryTask.estimatedHours && repositoryTask.estimatedHours > 0) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {
            $inc: {"estimatedHours": repositoryTask.estimatedHours}
        })
    }

    /*  let thisTaskWithRepoAlreadyExist = await EstimationTaskModel.findOne({
          "repo._id": repositoryTask._id,
          "estimation._id": estimation._id
      })
      */
    //if (thisTaskWithRepoAlreadyExist)
    //   throw new AppError('This task is already part of estimation', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)


    let estimationTask = new EstimationTaskModel()
    // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
    estimationTask.estimator.name = repositoryTask.name
    estimationTask.estimator.description = repositoryTask.description
    estimationTask.status = SC.STATUS_PENDING
    estimationTask.addedInThisIteration = true
    estimationTask.canApprove = false
    estimationTask.owner = SC.OWNER_ESTIMATOR
    estimationTask.estimation = estimation
    estimationTask.technologies = estimation.technologies
    estimationTask.type = SC.TYPE_DEVELOPMENT
    estimationTask.repo = {}
    //estimationTask.repo._id = repositoryTask._id
    estimationTask.repo.addedFromThisEstimation = true
    //conditions for has error
    if (!repositoryTask.name
        || _.isEmpty(repositoryTask.name)
        || !repositoryTask.description
        || _.isEmpty(repositoryTask.description)
        || !repositoryTask.estimatedHours
        || repositoryTask.estimatedHours == 0) {
        estimationTask.hasError = true
    } else estimationTask.hasError = false

    if (repositoryTask.estimatedHours)
        estimationTask.estimator.estimatedHours = repositoryTask.estimatedHours
    else
        estimationTask.estimator.estimatedHours = 0
    await estimationTask.save()
    estimationTask = estimationTask.toObject()
    if (estimation && estimation.canApprove) {
        estimationTask.isEstimationCanApprove = true
    }
    return estimationTask


}


// copy task from repo by negotiator
const copyTaskFromRepositoryByNegotiator = async (estimationID, repositoryTaskID, negotiator) => {

    if (!negotiator || !userHasRole(negotiator, SC.ROLE_NEGOTIATOR))
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryTask = await MDL.RepositoryModel.findById(repositoryTaskID)
    if (!repositoryTask)
        throw new AppError('Task not found in repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    /**
     TODO: Need to uncomment code once we have repository task approval feature in place
     if (!_.includes([SC.STATUS_APPROVED], repositoryTask.status))
     throw new AppError('This repository task is not yet approved so cannot be added to this estimation', EC.ACCESS_DENIED, EC.HTTP_BAD_REQUEST)
     **/

    if (repositoryTask.isFeature)
        throw new AppError('This is not a task but a feature', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findById(estimationID)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Estimation has status as [" + estimation.status + "]. Negotiator can add task from repository into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + "," + SC.STATUS_INITIATED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not a Negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    if (estimation && estimation._id && repositoryTask.estimatedHours && repositoryTask.estimatedHours > 0) {
        await MDL.EstimationModel.updateOne({_id: estimation._id}, {
            $inc: {"estimatedHours": repositoryTask.estimatedHours}
        })
    }
    /*let checkExistsCount = await EstimationTaskModel.count({
        "repo._id": repositoryTask._id,
        "estimation._id": estimation._id
    })
    if (checkExistsCount > 0)
        throw new AppError('This task from repository already added', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)*/

    // As task is added from repository its information can directly be copied into estimator section (even if it is being added by negotiator)
    let taskFromRepositoryObj = new EstimationTaskModel()
    taskFromRepositoryObj.negotiator.name = repositoryTask.name
    taskFromRepositoryObj.negotiator.description = repositoryTask.description
    taskFromRepositoryObj.negotiator.estimatedHours = repositoryTask.estimatedHours ? repositoryTask.estimatedHours : 0
    taskFromRepositoryObj.status = SC.STATUS_PENDING
    taskFromRepositoryObj.addedInThisIteration = true
    taskFromRepositoryObj.owner = SC.OWNER_NEGOTIATOR
    taskFromRepositoryObj.canApprove = false

    taskFromRepositoryObj.estimation = estimation
    taskFromRepositoryObj.technologies = estimation.technologies
    taskFromRepositoryObj.type = SC.TYPE_DEVELOPMENT

    taskFromRepositoryObj.repo = {}
    //taskFromRepositoryObj.repo._id = repositoryTask._id
    taskFromRepositoryObj.repo.addedFromThisEstimation = true
    if (!repositoryTask.name
        || _.isEmpty(repositoryTask.name)
        || !repositoryTask.description
        || _.isEmpty(repositoryTask.description)
        || !repositoryTask.estimatedHours
        || repositoryTask.estimatedHours == 0) {
        taskFromRepositoryObj.hasError = true
    } else taskFromRepositoryObj.hasError = false

    let taskFromRepo = await EstimationTaskModel.create(taskFromRepositoryObj)
    taskFromRepo = taskFromRepo.toObject()
    if (estimation && estimation.canApprove) {
        taskFromRepo.isEstimationCanApprove = true
    }
    return taskFromRepo

}


// reOpen task
estimationTaskSchema.statics.reOpenTask = async (taskID, user) => {
    let task = await EstimationTaskModel.findById(mongoose.Types.ObjectId(taskID))
    if (!task)
        throw new AppError('Task not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    if (!task.estimation || !task.estimation._id)
        throw new AppError('Estimation Identifier required at [estimation._id]', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let estimation = await MDL.EstimationModel.findOne({"_id": task.estimation._id})
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let role = await MDL.EstimationModel.getUserRoleInEstimation(estimation._id, user)
    if (role === SC.ROLE_ESTIMATOR) {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can directly reOpen task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    } else if (role === SC.ROLE_NEGOTIATOR) {
        return await reOpenTaskByNegotiator(task, estimation, user)
    }
    throw new AppError('You play no role in this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
}


// reOpen task by negotiator
const reOpenTaskByNegotiator = async (task, estimation, negotiator) => {

    let estimationFeatureObj

    if (estimation.status === SC.STATUS_APPROVED)
        throw new AppError('Estimation is already approved task can not be reopen ', EC.HTTP_BAD_REQUEST)

    if (!_.includes([SC.STATUS_REVIEW_REQUESTED], estimation.status))
        throw new AppError("Negotiator has status as [" + estimation.status + "]. Negotiator can only ReOpen task into those estimations where status is in [" + SC.STATUS_REVIEW_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not an negotiator', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)
    if (task && task.feature && task.feature._id) {
        estimationFeatureObj = await MDL.EstimationFeatureModel.findById(task.feature._id)
        if (!estimationFeatureObj)
            throw new AppError('Feature not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

        await MDL.EstimationFeatureModel.updateOne({"_id": task.feature._id}, {
            "status": SC.STATUS_PENDING,
            "canApprove": false
        })
    }

    task.status = SC.STATUS_PENDING
    task.canApprove = true
    task.negotiator.changedInThisIteration = true
    await task.save()
    task = task.toObject()

    if (estimationFeatureObj && estimationFeatureObj.canApprove) {
        task.isFeatureCanApprove = true
    }
    if (estimationFeatureObj && estimationFeatureObj.status === SC.STATUS_APPROVED) {
        task.isFeatureApproved = true
    }

    if (estimation && estimation.canApprove) {
        task.isEstimationCanApprove = true
    }

    return task

}


const EstimationTaskModel = mongoose.model("EstimationTask", estimationTaskSchema)
export default EstimationTaskModel
