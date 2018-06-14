import mongoose from 'mongoose'
import * as V from '../validation'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import AppError from '../AppError'
import * as MDL from '../models'

mongoose.Promise = global.Promise

let employeeDaysSchema = mongoose.Schema({
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Employee name is required']},
    },
    date: {type: Date, default: Date.now()},
    dateString: String,
    plannedHours: {type: Number, default: 0}
})


employeeDaysSchema.statics.addEmployeeDaysDetails = async (EmployeeDaysInput) => {
    V.validate(EmployeeDaysInput, V.employeeAddEmployeeDaysStruct)
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate

    let countDate = await EmployeeDaysModel.count({
        "employee._id": mongoose.Types.ObjectId(EmployeeDaysInput.employee._id),
        "date": EmployeeDaysInput.date
    })
    if (countDate > 0) {
        throw new AppError('Employee days detail is already available on this date ' + EmployeeDaysInput.date + ' with employee ' + EmployeeDaysInput.employee.name + 'can not create another', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.create(EmployeeDaysInput)
}

employeeDaysSchema.statics.increasePlannedHoursOnEmployeeDaysDetails = async (EmployeeDaysInput) => {
    V.validate(EmployeeDaysInput, V.employeeUpdateEmployeeDaysStruct)
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate
    let count = await EmployeeDaysModel.count({"date": EmployeeDaysInput.date})
    if (count <= 0) {
        throw new AppError('Employee days detail is not available on this date ' + EmployeeDaysInput.date + 'with employee ' + EmployeeDaysInput.employee.name + ' can not update ', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.update({
        "date": EmployeeDaysInput.date,
        "employee._id": mongoose.Types.ObjectId(EmployeeDaysInput.employee._id)
    }, {
        $inc: {"plannedHours": EmployeeDaysInput.plannedHours}
    })
}

employeeDaysSchema.statics.decreasePlannedHoursOnEmployeeDaysDetails = async (EmployeeDaysInput, user) => {
    let momentEmployeeDate = momentTZ.tz(EmployeeDaysInput.dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).clone().hour(0).minute(0).second(0).millisecond(0)
    EmployeeDaysInput.date = momentEmployeeDate

    V.validate(EmployeeDaysInput, V.employeeUpdateEmployeeDaysStruct)
    let count = await EmployeeDaysModel.count({"date": EmployeeDaysInput.date})
    if (count <= 0) {
        throw new AppError('Employee days detail is not available on this date ' + EmployeeDaysInput.date + 'with employee ' + EmployeeDaysInput.employee.name + ' can not update ', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeDaysModel.update({
        "date": EmployeeDaysInput.date,
        "employee._id": mongoose.Types.ObjectId(EmployeeDaysInput.employee._id)
    }, {
        $inc: {"plannedHours": -EmployeeDaysInput.plannedHours}
    })
}

employeeDaysSchema.statics.getActiveEmployeeDays = async (user) => {
    return await EmployeeDaysModel.find({})
}


employeeDaysSchema.statics.getEmployeeSchedule = async (employeeID, from, user) => {
    if (!employeeID) {
        throw new AppError('Employee is not selected, please select any employee', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (!from) {
        throw new AppError('From Date is not selected, please select any date', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    let fromString = moment(from).format(SC.DATE_FORMAT)
    let fromMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    let now = new Date()
    let nowString = moment(from).format(SC.DATE_FORMAT)
    let nowMoment = momentTZ.tz(nowString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    if (fromMoment.isBefore(nowMoment)) {
        throw new AppError('Selected date is before now can not see details before now', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    let toMoment = momentTZ.tz(fromString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).add(6, 'days').hour(0).minute(0).second(0).millisecond(0)
    if (employeeID && employeeID.toLowerCase() == "all") {
        //console.log("selected employee", employeeID)
        let allDevelopers = await MDL.UserModel.find({"roles.name": SC.ROLE_DEVELOPER}).exec()
        if (!allDevelopers || !allDevelopers.length) {
            throw new AppError('No developer is available ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }

        let employeeDays = await EmployeeDaysModel.aggregate([{
            $match: {date: {$gte: fromMoment.clone().toDate(), $lte: toMoment.clone().toDate()}}
        }, {
            $group: {
                _id: {
                    "employeeID": "$employee._id"
                },
                employee: {$first: "$employee"},
                days: {$push: {_id: "$_id", dateString: "$dateString", plannedHours: "$plannedHours", date: "$date"}}
            }
        }]).exec()
        if (employeeDays && employeeDays.length && allDevelopers.length == employeeDays.length) {
            // if there is any details available for any employee
            return employeeDays
        }
        else {
            let employeeDaysArray = allDevelopers.map(developer => {
                let selectedDeveloper = employeeDays && employeeDays.length ? employeeDays.find(emp => developer._id.toString() === emp.employee._id.toString()) : {}
                if (selectedDeveloper && selectedDeveloper._id) {
                    return selectedDeveloper
                } else {
                    return {
                        employee: {
                            _id: developer._id,
                            name: developer.firstName + ' ' + developer.lastName
                        },
                        days: []
                    }
                }
            })
            // if there is no any details available for any employee
            return employeeDaysArray
        }
    } else {
        // Check employee is a valid employee
        let selectedEmployee = await MDL.UserModel.findById(mongoose.Types.ObjectId(employeeID)).exec()
        if (!selectedEmployee) {
            throw new AppError('Employee is not valid employee', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }
        //console.log("selectedEmployee._id", selectedEmployee._id)
        let employeeDays = await EmployeeDaysModel.aggregate([{
            $match: {
                $and: [
                    {date: {$gte: fromMoment.clone().toDate(), $lte: toMoment.clone().toDate()}},
                    {"employee._id": mongoose.Types.ObjectId(selectedEmployee._id)}
                ]
            }
        }, {
            $group: {
                _id: {
                    "employeeID": "$employee._id"
                },
                employee: {$first: "$employee"},
                days: {$push: {_id: "$_id", dateString: "$dateString", plannedHours: "$plannedHours", date: "$date"}}
            }
        }]).exec()
        if (employeeDays && employeeDays.length) {
            // if there is any details available for selected employee
            return employeeDays
        }
        else {
            // if there is no any details available for selected employee
            return employeeDays = [{
                employee: {
                    _id: selectedEmployee._id,
                    name: selectedEmployee.firstName + ' ' + selectedEmployee.lastName,
                    days: []
                }
            }]
        }
    }
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
