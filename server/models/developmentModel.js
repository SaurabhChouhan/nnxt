import mongoose from 'mongoose'
import * as V from "../validation";
import AppError from "../AppError";
import * as EC from "../errorcodes";

let developmentSchema = mongoose.Schema({
    name: {type: String, required: true}
})

developmentSchema.statics.getAllActive = async () => {
    return await DevelopmentModel.find({})
}

developmentSchema.statics.exists = async name => {
    let count = await DevelopmentModel.count({'name': name})
    if (count > 0)
        return true
    return false
}

developmentSchema.statics.saveDevelopmentType = async (developmentInput) => {
    V.validate(developmentInput, V.technologyAdditionStruct)
    if (await DevelopmentModel.exists(developmentInput.name)) {
        throw new AppError("Development type with name [" + developmentInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await DevelopmentModel.create(developmentInput)
}

const DevelopmentModel = mongoose.model('Development', developmentSchema)
export default DevelopmentModel