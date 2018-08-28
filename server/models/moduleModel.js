import mongoose from 'mongoose'
import AppError from '../AppError'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import {userHasRole} from "../utils"
import ProjectModel from "./projectModel";


mongoose.Promise = global.Promise

let moduleSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'module name is required']
    },
    project: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    canHardDelete: {type: Boolean, default: true}
})


moduleSchema.statics.getAllActive = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_NEGOTIATOR)) {
        // Negotiator can see all modules (Estimation Initiate)
        return await ModuleModel.find({isDeleted: false, isArchived: false}).exec()
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}


moduleSchema.statics.saveModule = async moduleInput => {
    if (await ModuleModel.exists(moduleInput.name, moduleInput.project._id))
        throw new AppError("Module with name [" + moduleInput.name + "] already exists under this project", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let project = await MDL.ProjectModel.findById(moduleInput.project._id)
    if (!project)
        throw new AppError("No such client", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    moduleInput.project = project
    moduleInput.project.isActive = true
    return await ModuleModel.create(moduleInput)
}

moduleSchema.statics.exists = async (name, projectId) => {
    if (!name || !projectId)
        throw new AppError("ModuleModel->exists() method needs non-null name/clientId parameter", EC.BAD_ARGUMENTS)
    let count = await ModuleModel.count({'name': name, 'project._id': projectId})
    if (count > 0)
        return true
    return false
}

moduleSchema.statics.Delete = async (id) => {
    let module = await ModuleModel.findById(id)
    let response = undefined

    let moduleCount = await MDL.EstimationModel.count({
        'module._id': module._id,
        'isDeleted': false
    }) || await MDL.ReleaseModel.count({
        'module._id': module._id,

    })


    if (moduleCount > 0) {
        throw new AppError(' this module is available in estimation as well as release', EC.MODULE_USED_IN_ESTIMATION, EC.HTTP_BAD_REQUEST)
    }

    if (module.canHardDelete) {
        response = await ModuleModel.findById(id).remove()
    }
    else {
        module = await ModuleModel.findById(id)
        module.isDeleted = true
        response = await module.save()
    }

    return response
}
moduleSchema.statics.editModule = async moduleInput => {
    let module = await ModuleModel.findById(moduleInput._id)
    if (await ModuleModel.exists(moduleInput.name, moduleInput.project._id)) {
        throw new AppError("Module [" + module.project._id + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    if (module) {
        module.name = moduleInput.name
        let project = await MDL.ProjectModel.findById(moduleInput.project._id)
        console.log("project", project)
        console.log("moduleInput.project._id", moduleInput.project._id)
        if (!project) {
            throw new AppError("Project Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }
        module.project = project
        return await module.save()
    }
}

const ModuleModel = mongoose.model('Module', moduleSchema)
export default ModuleModel
