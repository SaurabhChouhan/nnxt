import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as V from "../validation"
import * as MDL from "./index";
import ProjectModel from "./projectModel";


let technologySchema = mongoose.Schema({
    name: {type: String, required: true}
})


technologySchema.statics.getAllActive = async () => {
    return await TechnologyModel.find({})
}

technologySchema.statics.saveTechnology = async (technologyInput) => {
    V.validate(technologyInput, V.technologyAdditionStruct)
    if (await TechnologyModel.exists(technologyInput.name)) {
        throw new AppError("Technology with name [" + technologyInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await TechnologyModel.create(technologyInput)
}

technologySchema.statics.delete = async (id) => {
    let technology = await TechnologyModel.findById(id)
    let response = undefined

    let technologyCount = await MDL.EstimationModel.count({
        'technologies._id': technology._id,
        'isDeleted': false
    }) || await MDL.ReleaseModel.count({
        'technologies._id': technology._id,

    })


    if (technologyCount > 0) {
        throw new AppError(' this technology is available in estimation as well as release', EC.TECHNOLOGY_USED_IN_ESTIMATION, EC.HTTP_BAD_REQUEST)
    }
    else {
        response = await TechnologyModel.findById(id).remove()
    }

    return response
}


technologySchema.statics.exists = async name => {
    let count = await TechnologyModel.count({'name': name})
    if (count > 0)
        return true
    return false
}

const TechnologyModel = mongoose.model('Technology', technologySchema)
export default TechnologyModel