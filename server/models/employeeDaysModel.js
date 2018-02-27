import mongoose from 'mongoose'

mongoose.Promise = global.Promise

let employeeDaysSchema = mongoose.Schema({
    project: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Project name is required']},
    },
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Employee name is required']},
    },
    date: {type: Date, default: Date.now()},
    dateString: String,
    plannedHours: {type: Number, default: 0}
})

const EmployeeDaysModel = mongoose.model("EmployeeDays", employeeDaysSchema)
export default EmployeeDaysModel

