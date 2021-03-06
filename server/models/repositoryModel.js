import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants"
import {userHasRole} from "../utils"
import * as EC from "../errorcodes"
import * as V from '../validation'
import * as MDL from "../models"

mongoose.Promise = global.Promise

let repositorySchema = mongoose.Schema({
    name: {type: String, required: [true, 'Task/Feature name is required']},
    description: {type: String, required: [true, 'Task/Feature description is required']},
    estimation: {_id: {type: mongoose.Schema.ObjectId}},
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

repositorySchema.statics.isTaskExists = async (name) => {
    let count = await RepositoryModel.count({'name': name})

    if (count > 0)
        return true
    return false
}

repositorySchema.statics.isFeatureExists = async (name) => {
    let count = await RepositoryModel.count({'name': name, 'isFeature': true})
    if (count > 0)
        return true
    return false
}

repositorySchema.statics.getFeature = async (repositoryFeatureID) => {
    let features = await RepositoryModel.aggregate({
        $match: {_id: mongoose.Types.ObjectId(repositoryFeatureID), isFeature: true}
    }, {
        $unwind: {
            path: '$tasks'
        }
    }, {
        $lookup: {
            from: 'repositories',
            localField: 'tasks._id',
            foreignField: '_id',
            as: 'tasks'
        }
    }, {
        $group: {
            _id: "$_id",
            name: {$first: "$name"},
            description: {$first: "$description"},
            isFeature: {$first: "$isFeature"},
            technologies: {$first: "$technologies"},
            tags: {$first: "$tags"},
            tasks: {
                $push: {$arrayElemAt: ['$tasks', 0]}
            }
        }
    })

    if (features.length > 0)
        return features[0]
}


repositorySchema.statics.addTask = async (taskInput, user) => {

    V.validate(taskInput, V.repositoryAddTaskStruct)

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

    V.validate(featureInput, V.repositoryAddTaskStruct)

    const estimation = await MDL.EstimationModel.findById(featureInput.estimation._id)
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

    V.validate(featureInput, V.repositoryUpdateTaskAndFeatureStruct)
    const repositoryFeature = await RepositoryModel.findById(featureInput._id)
    if (!repositoryFeature)
        throw new AppError('Feature not found in Repository', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    // check to see if estimation from where this feature was added is same a sent in feature

    if (featureInput.estimation._id == repositoryFeature.estimation._id) {
        //repository would be changed
        repositoryFeature.name = featureInput.name
        repositoryFeature.description = featureInput.description
        repositoryFeature.technologies = featureInput.technologies
        repositoryFeature.tags = featureInput.tags
        await repositoryFeature.save()
        return true
    } else {
        //No changes to feature in repository as feature does not belong to estimation
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
        //No changes in repository as estimation id do not match
        return false
    }
}


repositorySchema.statics.moveTaskToFeature = async (repositoryTaskID, repositoryFeatureID, estimationID) => {
    let repositoryTask = await RepositoryModel.findById(repositoryTaskID)

    if (!repositoryTask)
        throw new AppError('Task not found in repository')

    if (repositoryTask.estimation._id.toString() != estimationID.toString()) {
        //No changes in repository as estimation of task mismatches with current estimation
        return false
    }

    let repositoryFeature = await RepositoryModel.findById(repositoryFeatureID)

    if (!repositoryFeature)
        throw new AppError('Feature not found in repository')

    if (repositoryFeature.estimation._id.toString() != estimationID.toString()) {
        //No changes in repository as estimation of feature mismatches with current estimation
        return false
    }

    if (Array.isArray(repositoryFeature.tasks) && repositoryFeature.tasks.length > 0) {
        if (repositoryFeature.tasks.findIndex(t => t._id.toString() == repositoryTask._id.toString()) == -1) {
            // task is not already part of feature so add it
            repositoryFeature.tasks.push(repositoryTask)
            repositoryFeature.save()
        } else {
            //Task already part of feature
            return false
        }
    } else {
        repositoryFeature.tasks = [repositoryTask]
        repositoryFeature.save()
    }

    return true
}

repositorySchema.statics.moveTaskOutOfFeature = async (repositoryTaskID, repositoryFeatureID, estimationID) => {
    let repositoryTask = await RepositoryModel.findById(repositoryTaskID)

    if (!repositoryTask)
        throw new AppError('Task not found in repository')

    if (repositoryTask.estimation._id.toString() != estimationID.toString()) {
        //No changes in repository as estimation of task mismatches with current estimation
        return false
    }

    let repositoryFeature = await RepositoryModel.findById(repositoryFeatureID)

    if (!repositoryFeature)
        throw new AppError('Feature not found in repository')

    if (repositoryFeature.estimation._id.toString() != estimationID.toString()) {
        //No changes in repository as estimation of feature mismatches with current estimation
        return false
    }

    if (Array.isArray(repositoryFeature.tasks) && repositoryFeature.tasks.length > 0) {
        if (repositoryFeature.tasks.findIndex(t => t._id.toString() == repositoryTask._id.toString()) != -1) {
            // task is part of feature
            repositoryFeature.tasks.remove(repositoryTask._id)
            repositoryFeature.save()
        } else {
            //Task not part of feature cannot move out
            return false
        }
    } else {
        //Task not part of feature cannot move out
        return false
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

    let matchConditions = []
    if (filterObj.type.toLowerCase() && filterObj.type == 'Feature') {
        matchConditions.push({
            $match: {
                "isFeature": true
            }
        })
    } else if (filterObj.type.toLowerCase() && filterObj.type == 'Task') {
        matchConditions.push({
            $match: {
                "isFeature": false
            }
        })
    } else {
        //search for all
    }

    // TODO: Later on we need to paginate search rather than returning all tasks features of repository
    if (technologies.length > 0)
        matchConditions.push({
            $match: {
                "technologies": {$in: technologies},
            }
        })

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

    matchConditions.push({$project: project})

    let totalArrayResult = await
        RepositoryModel.aggregate(matchConditions).exec()

    return totalArrayResult
}
const RepositoryModel = mongoose.model("Repository", repositorySchema)
export default RepositoryModel
