import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {HTTP_BAD_REQUEST} from "../errorcodes";
import {NOT_FOUND} from "../errorcodes";
import ProjectModel from "./projectModel";
import {ALREADY_EXISTS} from "../errorcodes";

mongoose.Promise = global.Promise

let clientSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Client name is required']
    },
    email: String,
    country: String,
    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    canHardDelete: {type: Boolean, default: true}
})

clientSchema.statics.getAllActive = async () => {
    return await ClientModel.find({isDeleted: false, isArchived: false})
}

clientSchema.statics.saveClient = async clientInput => {
    if (await ClientModel.exists(clientInput.name)) {
        throw new AppError("Client with name [" + clientInput.name + "] already exists", ErrorCodes.ALREADY_EXISTS, ErrorCodes.HTTP_BAD_REQUEST)
    }

    return await ClientModel.create(clientInput)
}

clientSchema.statics.exists = async name => {
    if (!name)
        throw new AppError("ClientModel->exists() method needs non-null name parameter", ErrorCodes.BAD_ARGUMENTS)
    let count = await ClientModel.count({'name': name})
    if (count > 0)
        return true
    return false
}

clientSchema.statics.delete = async (id)=> {
    let response = await ClientModel.findById(id).remove()
    return response
}
clientSchema.statics.deleteClient = async (id)=> {
    let client = await ClientModel.findById(id)
    let response=undefined

    if (client.canHardDelete){
        response = await ClientModel.findById(id).remove()
    }
    else{
        response = await ClientModel.findById(id)
        client.isDeleted=true
        response = await client.save()
    }

    return response
}
clientSchema.statics.editClient = async clientInput => {
    console.log("check the project Input data",clientInput)
    let client = await ClientModel.findById(clientInput._id)
    //let count = await ProjectModel.count({'name': projectInput.name, 'client._id': projectInput.client._id})
    if (await ClientModel.exists(clientInput.name))
    {
        throw new AppError("Client [" + client._id+ "] already exists", ALREADY_EXISTS, HTTP_BAD_REQUEST)
    }

        client.name = clientInput.name

        return await client.save()

}


const ClientModel = mongoose.model("Client", clientSchema)
export default ClientModel
