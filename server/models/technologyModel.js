import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import {validate, technologyAdditionStruct} from "../validation"


let technologySchema = mongoose.Schema({
    name: {type: String, required: true}
})


technologySchema.statics.saveTechnology = async (technologyInput) => {
    validate(technologyInput, technologyAdditionStruct)
    if (await TechnologyModel.exists(technologyInput.name)) {
        throw new AppError("Technology with name [" + technologyInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await TechnologyModel.create(technologyInput)
}


technologySchema.statics.exists = async name => {
    let count = await TechnologyModel.count({'name': name})
    if (count > 0)
        return true
    return false
}

const TechnologyModel = mongoose.model('Technology', technologySchema)
export default TechnologyModel