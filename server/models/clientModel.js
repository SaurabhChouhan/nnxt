import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "./index";
import BillingRateModel from './billingRateModel'
import { OWNER_TYPE_CLIENT } from '../serverconstants'

mongoose.Promise = global.Promise

let clientSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Client name is required']
    },
    email: String,
    country: String,
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    canHardDelete: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
})

clientSchema.statics.getAllActive = async () => {
    return await ClientModel.find({ isDeleted: false, isArchived: false })
}

clientSchema.statics.getAllActiveClients = async () => {
    return await ClientModel.find({ isDeleted: false, isArchived: false, isActive: true })
}


clientSchema.statics.saveClient = async (clientInput, user) => {
    if (await ClientModel.exists(clientInput.name)) {
        throw new AppError("Client with name [" + clientInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    let client = await ClientModel.create(clientInput)

    if (clientInput.billingRate) {
        // create new entry
        let billingRate = new BillingRateModel()
        billingRate.billingRate = clientInput.billingRate
        billingRate.created = {
            _id: user._id,
            name: user.firstName,
            date: new Date()
        }

        billingRate.owner = {
            type: OWNER_TYPE_CLIENT,
            _id: client._id
        }
        await billingRate.save()
    }

    return client
}

clientSchema.statics.exists = async name => {
    if (!name)
        throw new AppError("ClientModel->exists() method needs non-null name parameter", EC.BAD_ARGUMENTS)
    let count = await ClientModel.count({ 'name': name })
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

    let canHardDelete = true

    if (projectCount > 0) {
        canHardDelete = false
    }

    if (canHardDelete) {
        response = await ClientModel.findById(id).remove()
    }
    else {
        response = await ClientModel.findById(id)
        client.isDeleted = true
        response = await client.save()
    }

    return response
}
clientSchema.statics.editClient = async (clientInput, user) => {
    let client = await ClientModel.findById(clientInput._id)

    if (!client)
        throw new AppError("No client found", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let count = await ClientModel.count({
        name: clientInput.name,
        _id: { $ne: client._id }
    })

    if (count > 0)
        throw new AppError("Name [" + clientInput.name + "] already in use", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    // see if billing rate is present, add, update billing rate accordingly
    // try to get exiting billing rate entry (if any) for client

    let billingRate = await BillingRateModel.findOne({ "owner.type": OWNER_TYPE_CLIENT, "owner._id": client._id })

    if (clientInput.billingRate) {
        if (!billingRate) {
            // create new entry
            billingRate = new BillingRateModel()
            billingRate.billingRate = clientInput.billingRate
            billingRate.created = {
                _id: user._id,
                name: user.firstName,
                date: new Date()
            }

            billingRate.owner = {
                type: OWNER_TYPE_CLIENT,
                _id: client._id
            }
        } else {
            billingRate.billingRate = clientInput.billingRate
            billingRate.updated = {
                _id: user._id,
                name: user.firstName,
                date: new Date()
            }
        }
        await billingRate.save()
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
