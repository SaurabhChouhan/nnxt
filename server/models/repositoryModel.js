import mongoose from 'mongoose'
import AppError from '../AppError'
import {
    ROLE_ESTIMATOR, ROLE_NEGOTIATOR, STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED,
    TYPE_DEVELOPMENT
} from "../serverconstants";
import {userHasRole} from "../utils"
import {INVALID_USER, NOT_FOUND, HTTP_BAD_REQUEST} from "../errorcodes"
import {validate, repositoryAddTaskStruct} from "../validation"
import {EstimationModel} from "./"

mongoose.Promise = global.Promise

let repositorySchema = mongoose.Schema({
    name: {type: String, required: [true, 'Task/Feature name is required']},
    description: {type: String, required: [true, 'Task/Feature description is required']},
    estimation: {_id: {type: mongoose.Schema.ObjectId, required: true}},
    status: {type: String, enum: [STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED]},
    type: {type: String, enum: [TYPE_DEVELOPMENT]},
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
    if (!user || (!userHasRole(user, ROLE_NEGOTIATOR) && !userHasRole(user, ROLE_ESTIMATOR)))
        throw new AppError('Only user with any of the roles [' + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can add task to repository", INVALID_USER, HTTP_BAD_REQUEST)

    validate(taskInput, repositoryAddTaskStruct)

    const estimation = await EstimationModel.findById(taskInput.estimation._id)
    if (!estimation)
        throw new AppError('Estimation not found', NOT_FOUND, HTTP_BAD_REQUEST)

    taskInput.status = STATUS_PENDING
    taskInput.isFeature = false
    taskInput.isPartOfEstimation = true
    taskInput.type = TYPE_DEVELOPMENT
    taskInput.foundationTask = false
    taskInput.hasHistory = false
    taskInput.createdBy = user
    return await RepositoryModel.create(taskInput)

}

repositorySchema.statics.get = async () => {
    /*Currently api return all repository task/features with out any filters, filter will be apply in next.*/
    return await RepositoryModel.find({})
}

const RepositoryModel = mongoose.model("Repository", repositorySchema)
export default RepositoryModel
