import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'
import {validate, clientAdditionStruct} from "../validation"

mongoose.Promise = global.Promise

let clientSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Client name is required']
    },
    email: String,
    country: String,
    isDeleted: {type: Boolean, default: false}
})


clientSchema.statics.saveClient = async clientInput => {
    validate(clientInput, clientAdditionStruct)
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


const ClientModel = mongoose.model("Client", clientSchema)
export default ClientModel
