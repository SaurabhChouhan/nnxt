import mongoose from 'mongoose'
import AppError from '../AppError'

mongoose.Promise = global.Promise


let taskSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Task name is required']
    },
    description: {type: String},
    status: {type: String, enum: ['pending', 'approved', 'rejected']},
    type: {type: String, enum: ['development', 'testing', 'management']},
    foundationTask: {type: Boolean, default: false},
    createdBy: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    createdDate: Date,
    technologies: [String],
    tags: [String]
})

const TaskModel = mongoose.model("Task", taskSchema)
export default TaskModel