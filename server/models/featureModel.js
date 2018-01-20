import mongoose from 'mongoose'
import AppError from '../AppError'

mongoose.Promise = global.Promise


let featureSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Feature name is required']
    },
    description: String,
    status: {type: String, enum: ['pending', 'approved', 'rejected']},
    createdBy: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    createdDate: Date,
    technologies: [String],
    tags: [String],
    tasks: [
        {
            _id: mongoose.Schema.ObjectId,
            name: String,
            description: String
        }
    ]
})

const FeatureModel = mongoose.model("Feature", featureSchema)
export default FeatureModel