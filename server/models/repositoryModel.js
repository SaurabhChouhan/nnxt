import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants";
import {userHasRole} from "../utils"
import * as EC from "../errorcodes"
import {validate, repositoryAddTaskStruct,repositoryUpdateTaskAndFeatureStruct} from "../validation"
import {EstimationModel,EstimationFeatureModel} from "./"
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
    if(!featureInput.repo && !featureInput.repo._id)
        throw new AppError('Repository not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const repository = await RepositoryModel.findById(featureInput.repo._id)

    if(_.includes([SC.STATUS_APPROVED], repository.status))
        throw new AppError("Repository has feature status as ["+repository.status+"]. Estimator can only update feature into those estimations where status is in [" + SC.STATUS_ESTIMATION_REQUESTED + ", " + SC.STATUS_CHANGE_REQUESTED + "]", EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)

    validate(featureInput, repositoryUpdateTaskAndFeatureStruct)

    repository.name = featureInput.name
    repository.description = featureInput.description
    repository.technologies = featureInput.technologies
    repository.tags = featureInput.tags
    return await repository.save()
}

const RepositoryModel = mongoose.model("Repository", repositorySchema)
export default RepositoryModel
