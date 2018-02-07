import mongoose from 'mongoose'
import AppError from '../AppError'
import {ClientModel} from "./"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import {userHasRole} from "../utils"

mongoose.Promise = global.Promise

let projectSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Project name is required']
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    canHardDelete: {type: Boolean, default: true}
})

projectSchema.statics.getAllActive = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_NEGOTIATOR)) {
        // Negotiator can see all projects (Estimation Initiate)
        return await ProjectModel.find({isDeleted: false, isArchived: false}).exec()
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}

projectSchema.statics.saveProject = async projectInput => {
    if (await ProjectModel.exists(projectInput.name, projectInput.client._id))
        throw new AppError("Project with name [" + projectInput.name + "] already exists under this client", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    let client = await ClientModel.findById(projectInput.client._id)
    if (!client)
        throw new AppError("No such client", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    projectInput.client = client
    return await ProjectModel.create(projectInput)
}

projectSchema.statics.exists = async (name, clientId) => {
    if (!name || !clientId)
        throw new AppError("ProjectModel->exists() method needs non-null name/clientId parameter", EC.BAD_ARGUMENTS)
    let count = await ProjectModel.count({'name': name, 'client._id': clientId})
    if (count > 0)
        return true
    return false
}

const ProjectModel = mongoose.model("Project", projectSchema)
export default ProjectModel
