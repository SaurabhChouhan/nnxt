import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants";
import {userHasRole} from "../utils"
import * as EC from "../errorcodes"
import {ProjectModel, UserModel} from "./"

mongoose.Promise = global.Promise

let releaseSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        lastName: String
    },
    name: {type: String, required: [true, 'Release Version name is required']},
    status: {type: String, enum: [SC.STATUS_PLAN_REQUESTED,SC.STATUS_DEV_IN_PROGRESS,SC.STATUS_DEV_COMPLETED,SC.STATUS_RELEASED,SC.STATUS_ISSUE_FIXING,SC.STATUS_OVER]},
    project: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name:{type:String,required: [true, 'Project name is required']}
    },
    manager: {
       _id: {type: mongoose.Schema.ObjectId, required: true},
       firstName:{type: String, required: [true, 'Manager name is required']},
       lastName: String,
       email:{type: String, required: [true, 'Manager email name is required']}
    },
    leader: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        firstName:{type: String, required: [true, 'Leader name is required']},
        lastName: String,
        email:{type: String, required: [true, 'Leader email name is required']}
    },
    team: [{
           _id: {type: mongoose.Schema.ObjectId, required: true},
           name:{type: String, required: [true, 'Team name is required']},
           email:{type: String, required: [true, 'Developer email name is required']}
    }],
    initial: {
        billedHours:{type: Number, default: 0},
        estimatedHours:{type: Number, default: 0},
        plannedHours:{type: Number, default: 0},
        reportedHours:{type: Number, default: 0},
        estimatedHoursPlannedTasks:{type: Number, default: 0},
        estimatedHoursCompletedTasks:{type: Number, default: 0},
        plannedHoursReportedTasks:{type: Number, default: 0},
        devStartDate: Date,
        devEndDate: Date,
        clientReleaseDate: Date,
        actualReleaseDate: Date,
        maxReportedDate: Date
    },
    additional: {
        billedHours:{type: Number, default: 0},
        estimatedHours:{type: Number, default: 0},
        plannedHours:{type: Number, default: 0},
        reportedHours:{type: Number, default: 0},
        estimatedHoursPlannedTasks:{type: Number, default: 0},
        estimatedHoursCompletedTasks:{type: Number, default: 0},
        plannedHoursReportedTasks:{type: Number, default: 0},
        devStartDate: Date,
        devEndDate: Date,
        clientReleaseDate: Date,
        actualReleaseDate: Date,
        maxReportedDate: Date
    },
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})

releaseSchema.statics.addRelease = async (projectAwardData, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR)))
        throw new AppError('Only user with of the roles [' + SC.ROLE_NEGOTIATOR + '] can add release', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let releaseInput = {}
    let initial = {}
    const project = await ProjectModel.findById(projectAwardData.estimation.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const manager = await UserModel.findOne({"_id":projectAwardData.manager._id,"roles.name":SC.ROLE_MANAGER})
    if (!manager)
        throw new AppError('Project Manager not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const leader = await UserModel.findById({"_id":projectAwardData.leader._id,"roles.name":SC.ROLE_LEADER})
    if (!leader)
        throw new AppError('Project Leader not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const projectAlreadyAwarded = await ReleaseModel.findOne({"project._id":projectAwardData.estimation.project._id})
    if (projectAlreadyAwarded)
        throw new AppError('Project already awarded', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    initial.billedHours = projectAwardData.billedHours
    initial.clientReleaseDate = projectAwardData.clientReleaseDate
    initial.devStartDate = projectAwardData.devStartDate
    initial.devEndDate = projectAwardData.devReleaseDate
    releaseInput.project = project
    releaseInput.manager = manager
    releaseInput.leader = leader
    releaseInput.team = projectAwardData.team
    releaseInput.initial = initial
    releaseInput.name = projectAwardData.releaseVersionName
    releaseInput.status = SC.STATUS_PLAN_REQUESTED
    releaseInput.user = user

    return  await ReleaseModel.create(releaseInput)
}


releaseSchema.statics.getReleases = async (user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR)))
        throw new AppError('Only user with of the roles [' + SC.ROLE_NEGOTIATOR + '] can get projects releases', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    return await ReleaseModel.find({"user._id" : user._id})
}

releaseSchema.statics.getReleaseById = async (releaseId, user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR)))
        throw new AppError('Only user with of the roles [' + SC.ROLE_NEGOTIATOR + '] can get projects releases', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    return await ReleaseModel.find({"_id": releaseId, "user._id": user._id})
}

const ReleaseModel = mongoose.model("Release", releaseSchema)
export default ReleaseModel
