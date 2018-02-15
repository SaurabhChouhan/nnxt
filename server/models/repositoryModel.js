import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants"
import {userHasRole} from "../utils"
import * as EC from "../errorcodes"
import {validate, repositoryAddTaskStruct, repositoryUpdateTaskAndFeatureStruct} from "../validation"
import {EstimationModel, EstimationFeatureModel} from "./"
import _ from 'lodash'

mongoose.Promise = global.Promise

let repositorySchema = mongoose.Schema({
    name: {type: String, required: [true, 'Task/Feature name is required']},
    description: {type: String, required: [true, 'Task/Feature description is required']},
    estimation: {_id: {type: mongoose.Schema.ObjectId, required: true}},
    status: {type: String, enum: [SC.STATUS_PENDING, SC.STATUS_APPROVED, SC.STATUS_REJECTED]},
    type: {type: String, enum: [SC.TYPE_DEVELOPMENT]},
    foundationTask: {type: Boolean, default: false},
    isFeature: {type: Boolean},
    isPartOfEstimation: {type: Boolean},
    hasHistory: {type: Boolean},
    createdBy: {_id: mongoose.Schema.ObjectId, firstName: String, lastName: String},
    created: {type: Date, default: Date.now()},
    technologies: [String],
    tags: [String],
    tasks: [{_id: {type: mongoose.Schema.ObjectId, required: true}}]
})

repositorySchema.statics.addTask = async (taskInput, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR) && !userHasRole(user, SC.ROLE_ESTIMATOR)))
        throw new AppError('Only user with any of the roles [' + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add task to repository", EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    validate(taskInput, repositoryAddTaskStruct)

    const estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    taskInput.status = SC.STATUS_PENDING
    taskInput.isFeature = false
    taskInput.isPartOfEstimation = true
    taskInput.type = SC.TYPE_DEVELOPMENT
    taskInput.foundationTask = false
    taskInput.hasHistory = false
    taskInput.createdBy = user
    return await RepositoryModel.create(taskInput)

}


repositorySchema.statics.get = async () => {
    /*Currently api return all repository task/features with out any filters, filter will be apply in next.*/
    return await RepositoryModel.find({})
}

repositorySchema.statics.addFeature = async (featureInput, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR) && !userHasRole(user, SC.ROLE_ESTIMATOR)))
        throw new AppError('Only user with any of the roles [' + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add feature to repository", EC.INVALID_USER, HTTP_BAD_REQUEST)

    validate(featureInput, repositoryAddTaskStruct)

    const estimation = await EstimationModel.findById(featureInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    featureInput.status = SC.STATUS_PENDING
    featureInput.isFeature = true
    featureInput.isPartOfEstimation = true
    featureInput.type = SC.TYPE_DEVELOPMENT
    featureInput.foundationTask = false
    featureInput.hasHistory = false
    featureInput.createdBy = user
    return await RepositoryModel.create(featureInput)
}

repositorySchema.statics.updateFeature = async (featureInput, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR) && !userHasRole(user, SC.ROLE_ESTIMATOR)))
        throw new AppError('Only user with any of the roles [' + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can update feature to repository", EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    validate(featureInput, repositoryUpdateTaskAndFeatureStruct)
    const repositoryFeature = await RepositoryModel.findById(featureInput._id)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    // check to see if estimation from where this feature was added is same a sent in feature

    if (featureInput.estimation._id == repositoryFeature.estimation._id) {
        console.log("repository would be changed")
        repositoryFeature.name = featureInput.name
        repositoryFeature.description = featureInput.description
        repositoryFeature.technologies = featureInput.technologies
        repositoryFeature.tags = featureInput.tags
        await repositoryFeature.save()
        return true
    } else {
        console.log("No changes to feature in repository as feature does not belong to estimation")
        return false
    }
}

repositorySchema.statics.updateTask = async (repo_id, taskInput, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR) && !userHasRole(user, SC.ROLE_ESTIMATOR)))
        throw new AppError('Only user with any of the roles [' + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can update task to repository", EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let repositoryTask = await RepositoryModel.findById(repo_id)
    if (!repositoryTask)
        throw new AppError('Task not found in repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (taskInput.estimation._id == repositoryTask.estimation._id) {
        repositoryTask.name = taskInput.name
        repositoryTask.description = taskInput.description
        repositoryTask.technologies = taskInput.technologies
        repositoryTask.tags = taskInput.tags
        return await repositoryTask.save()
    } else {
        console.log("No changes in repository as estimation id do not match")
        return false
    }
}

repositorySchema.statics.moveTaskToFeature = async (repositoryTaskID, repositoryFeatureID, estimationID) => {
    let repositoryTask = await RepositoryModel.findById(repositoryTaskID)

    console.log("sent estimation id is ", estimationID)

    if (!repositoryTask)
        throw new AppError('Task not found in repository')

    console.log("repository task estimation id is ", repositoryTask.estimation._id)

    if (repositoryTask.estimation._id.toString() != estimationID.toString()) {
        console.log("No changes in repository as estimation of task mismatches with current estimation")
        return false
    }

    let repositoryFeature = await RepositoryModel.findById(repositoryFeatureID)

    if (!repositoryFeature)
        throw new AppError('Feature not found in repository')

    console.log("repository feature estimation id is ", repositoryFeature.estimation._id)

    if (repositoryFeature.estimation._id.toString() != estimationID.toString()) {
        console.log("No changes in repository as estimation of feature mismatches with current estimation")
        return false
    }

    if (Array.isArray(repositoryFeature.tasks) && repositoryFeature.tasks.length > 0) {
        if (repositoryFeature.tasks.findIndex(t => t._id.toString() == repositoryTask._id.toString()) == -1) {
            // task is not already part of feature so add it
            repositoryFeature.tasks.push(repositoryTask)
            repositoryFeature.save()
        } else {
            console.log("Task already part of repository")
            return false
        }
    } else {
        repositoryFeature.tasks = [repositoryTask]
        repositoryFeature.save()
    }

    return true


}

repositorySchema.statics.searchRepositories = async (filterObj) => {
    let technologies = []
    if (filterObj.technologies && Array.isArray(filterObj.technologies)) {
        filterObj.technologies.forEach(function (technology) {
            technologies.push(new RegExp(technology, "i"))
        })
    } else {
        let technology = new RegExp(filterObj.technologies, "i")
        technologies = [technology]
    }

    let pipline = []
    if (filterObj.type.toLowerCase() && filterObj.type == 'Feature') {

        let case1 = {
            $match: {
                "isFeature": true
            }
        }

        pipline.push(case1)
    } else if (filterObj.type.toLowerCase() && filterObj.type == 'Task') {
        let case2 = {
            $match: {
                "isFeature": false
            }
        }

        pipline.push(case2)
    } else {
        console.log("search for all")
    }

    let defaultCase = {
        $match: {
            "technologies": {$in: technologies},
        }
    }

    pipline.push(defaultCase)

    let project = {
        name: 1,
        description: 1,
        estimation: 1,
        status: 1,
        type: 1,
        foundationTask: 1,
        isFeature: 1,
        isPartOfEstimation: 1,
        hasHistory: 1,
        createdBy: 1,
        created: 1,
        technologies: 1,
        tags: 1,
        tasks: 1
    }

    pipline.push({$project: project})

    let totalArrayResult = await
        RepositoryModel.aggregate(pipline).exec()

    return totalArrayResult
}
const RepositoryModel = mongoose.model("Repository", repositorySchema)
export default RepositoryModel
