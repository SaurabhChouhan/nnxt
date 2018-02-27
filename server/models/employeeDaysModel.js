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



employeeDaysSchema.statics.addEmployeeDaysDetails = async (EmployeeDaysInput,user) => {
    return await EmployeeDaysModel.create(EmployeeDaysInput)
}
employeeDaysSchema.statics.getActiveEmployeeDays = async (user) => {
    return await EmployeeDaysModel.find({})
}

const EmployeeDaysModel = mongoose.model("EmployeeDays", employeeDaysSchema)
export default EmployeeDaysModel


/*
{
    "project": {
        "_id": "5a8fc14733118914b0a548e4",
        "name": "project-management"
    },
    "employee": {
        "_id": "5a93bf9b2af17a16e808b340",
        "name": "gauravagrawal"
    },
    "dateString": "10/10/10",
    "plannedHours": 5
}
*/
