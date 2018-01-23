import mongoose from 'mongoose'
import AppError from '../AppError'
import * as ErrorCodes from '../errorcodes'

mongoose.Promise = global.Promise

let estimationSchema = mongoose.Schema({
    status: {type: String, enum: ['requested', 'estimated', 'correction-needed', 'approved', 'corrected']},
    technologies: [String],
    owner: {type: String, enum: ['estimator', 'negotiator', 'rejected']},
    estimator: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    negotiator: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    client: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    project: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    release: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    notes: [
        {
            name: {type: String, required: true},
            note: {type: String, required: true},
            date: {type: Date, default: Date.now()}
        }
    ]
})

const EstimationModel = mongoose.model("Estimation", estimationSchema)
export default EstimationModel