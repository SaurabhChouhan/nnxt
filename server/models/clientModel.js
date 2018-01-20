import mongoose from 'mongoose'
import AppError from '../AppError'

mongoose.Promise = global.Promise

let clientSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Client name is required']
    },
    email: String,
    country: String
})


clientSchema.statics.saveClient = async clientInput => {
    return await ClientModel.create(clientInput)
}

const ClientModel = mongoose.model("Client", clientSchema)
export default ClientModel
