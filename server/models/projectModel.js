import mongoose from 'mongoose'
import AppError from '../AppError'

mongoose.Promise = global.Promise

let projectSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Project name is required']
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    }
})

projectSchema.statics.saveProject = async projectInput => {
    return await ProjectModel.create(projectInput)
}

const ProjectModel = mongoose.model("Project", projectSchema)
export default ProjectModel
