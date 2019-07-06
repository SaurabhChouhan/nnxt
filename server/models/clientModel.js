import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "./index";
import ProjectModel from "./projectModel";

mongoose.Promise = global.Promise

let clientSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Client name is required']
    },
    email: String,
    country: String,
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    canHardDelete: {type: Boolean, default: true},
    isActive: {type: Boolean, default: true},
})

clientSchema.statics.getAllActive = async () => {
    return await ClientModel.find({isDeleted: false, isArchived: false})
}

clientSchema.statics.getAllActiveClients = async () => {
    return await ClientModel.find({isDeleted: false, isArchived: false, isActive: true})
}


clientSchema.statics.saveClient = async clientInput => {
    if (await ClientModel.exists(clientInput.name)) {
        throw new AppError("Client with name [" + clientInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    return await ClientModel.create(clientInput)
}

clientSchema.statics.exists = async name => {
    if (!name)
        throw new AppError("ClientModel->exists() method needs non-null name parameter", EC.BAD_ARGUMENTS)
    let count = await ClientModel.count({'name': name})
    if (count > 0)
        return true
    return false
}

clientSchema.statics.delete = async (id) => {
    let response = await ClientModel.findById(id).remove()
    return response
}
clientSchema.statics.deleteClient = async (id) => {
    let client = await ClientModel.findById(id)
    let response = undefined

    let projectCount = await MDL.ProjectModel.count({
        'client._id': client._id,
        'isDeleted': false
    })


    if (projectCount > 0) {
        throw new AppError('Cannot remove client, it is associated with projects.', EC.CLIENT_USED_IN_ESTIMATION, EC.HTTP_BAD_REQUEST)
    }

    if (client.canHardDelete) {
        response = await ClientModel.findById(id).remove()
    }
    else {
        response = await ClientModel.findById(id)
        client.isDeleted = true
        response = await client.save()
    }

    return response
}
clientSchema.statics.editClient = async clientInput => {
    let client = await ClientModel.findById(clientInput._id)
    //let count = await ProjectModel.count({'name': projectInput.name, 'client._id': projectInput.client._id})
    if (await ClientModel.exists(clientInput.name)) {
        throw new AppError("Client [" + client._id + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    client.name = clientInput.name

    return await client.save()

}


clientSchema.statics.isActiveClient = async (id) => {
    let client = await ClientModel.findById(id)
    if (!client) {
        throw new AppError("client Not Found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    client.isActive = !client.isActive
    return await client.save()

}


const ClientModel = mongoose.model("Client", clientSchema)
export default ClientModel
