import mongoose from 'mongoose'
import * as V from '../validation'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'

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


employeeDaysSchema.statics.addEmployeeDaysDetails = async (EmployeeDaysInput, user) => {
    V.validate(EmployeeDaysInput, V.employeeAddEmployeeDaysStruct)
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate

    let countDate = await EmployeeDaysModel.count({"date": EmployeeDaysInput.date})
    if (countDate > 0) {
        throw new AppError('Employee days detail is already available on this date ' + EmployeeDaysInput.date + ' can not create another', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.create(EmployeeDaysInput)
}

employeeDaysSchema.statics.increasePlannedHoursOnEmployeeDaysDetails = async (EmployeeDaysInput, user) => {
    V.validate(EmployeeDaysInput, V.employeeUpdateEmployeeDaysStruct)
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate
    let count = await EmployeeDaysModel.count({"date": EmployeeDaysInput.date})
    if (count <= 0) {
        throw new AppError('Employee days detail is not available on this date ' + EmployeeDaysInput.date + ' can not update ', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.update({
        "date": EmployeeDaysInput.date
    }, {
        $inc: {"plannedHours": EmployeeDaysInput.plannedHours}
    })
}

employeeDaysSchema.statics.decreasePlannedHoursOnEmployeeDaysDetails = async (EmployeeDaysInput, user) => {
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate

    V.validate(EmployeeDaysInput, V.employeeUpdateEmployeeDaysStruct)
    let count = await EmployeeDaysModel.count({"date": EmployeeDaysInput.date})
    if (count <= 0) {
        throw new AppError('Employee days detail is not available on this date ' + EmployeeDaysInput.date + ' can not update ', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.update({
        "date": EmployeeDaysInput.date
    }, {
        $inc: {"plannedHours": -EmployeeDaysInput.plannedHours}
    })
}

employeeDaysSchema.statics.getActiveEmployeeDays = async (user) => {
    return await EmployeeDaysModel.find({})
}

const EmployeeDaysModel = mongoose.model("EmployeeDay", employeeDaysSchema)
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
