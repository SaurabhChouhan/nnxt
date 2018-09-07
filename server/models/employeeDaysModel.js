import mongoose from 'mongoose'
import * as V from '../validation'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import AppError from '../AppError'
import * as MDL from '../models'
import logger from '../logger'
import * as U from '../utils'

mongoose.Promise = global.Promise

/**
 * Keeps information about total work planned against an employee on a particular date irrespective of which release he
 * is working on
 */

let employeeDaysSchema = mongoose.Schema({
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Employee name is required']},
    },
    date: {type: Date, default: Date.now()},
    dateString: String,
    plannedHours: {type: Number, default: 0},
    reportedHours: {type: Number, default: 0}
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
    EmployeeDaysInput.date = momentEmployeeDate.toDate()
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

const getEmployeeWorkCalendar = async (employee, startMonth, endMonth, startDay) => {

    let schedule = []

    // Fill each date with 0 hours so that days without work shows 0
    for (let i = 1; i <= endMonth.date(); i++) {
        schedule.push({
            date: i,
            hours: 0
        })
    }

    let weeklySchedule = []
    weeklySchedule.push([])

    for (let j = 1; j < startDay; j++) {
        // Fill those days with -1 for first week that do not have any date as first date comes on later day
        weeklySchedule[0].push({
            date: -1,
            hours: -1
        })
    }

    // Update those dates where employee has work
    let employeeDays = await EmployeeDaysModel.aggregate([{
        $match: {
            $and: [
                {date: {$gte: startMonth.toDate(), $lte: endMonth.toDate()}},
                {"employee._id": employee._id}
            ]
        }
    }, {
        $sort: {date: 1}
    }]).exec()

    /*
        We will now iterate over employee days in order to fill proper planned hours against each date
    */
    if (employeeDays && employeeDays.length) {
        employeeDays.forEach(e => {
            let date = U.momentInUTC(e.dateString).date()
            // place planned hours against this date
            schedule[date - 1].hours = e.plannedHours
        })
    }

    let k = 0;
    schedule.forEach(s => {
        if (startDay < 8) {
            weeklySchedule[k].push(s)
            startDay++
        } else {
            // sunday is passed start a new week
            weeklySchedule.push([])
            startDay = 2
            k++
            weeklySchedule[k].push(s)
        }
    })

    return {
        _id: employee._id,
        name: employee.name ? employee.name : U.getFullName(employee),
        schedule: weeklySchedule
    }
}

const getAllEmployeesWorkCalendar = async (employees, startMonth, endMonth, startDay) => {
    let schedules = []

    for (const employee of employees) {
        let employeeSchedule = await getEmployeeWorkCalendar(employee, startMonth, endMonth, startDay)
        schedules.push(employeeSchedule)
    }
    return schedules
}

employeeDaysSchema.statics.getMonthlyWorkCalendar = async (employeeID, month, year, user, releaseID) => {

    if (releaseID) {
        let userRolesInThisRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(releaseID, user)
        if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER], userRolesInThisRelease)) {
            throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can see employee schedules of that release', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
        }
    } else if (employeeID == SC.ALL) {
        if (!U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT))
            throw new AppError('Only user with role [' + SC.ROLE_TOP_MANAGEMENT + '] can see employee schedules of all employees', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let monthMoment = moment().month(month)
    monthMoment.year(year)
    if (!monthMoment.isValid())
        throw new AppError('Invalid month or year sent', EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    let startMonth = monthMoment.startOf('month')
    let endMonth = monthMoment.clone().endOf('month')
    let startDay = startMonth.day()
    if (startDay == 0)
    // this is sunday so make it as 7 as it would come last and it would be easier for logic to run
        startDay = 7

    logger.debug("getMonthlyWorkCalendar(): ", {startMonth})
    logger.debug("getMonthlyWorkCalendar(): ", {endMonth})

    // Now we will divide schedule into week rows

    let employeeSchedules = []
    if (employeeID == SC.ALL) {

        let developers;
        if (releaseID) {
            // Users of release is requested
            developers = await MDL.ReleaseModel.getReleaseEmployees(releaseID)
        } else {
            developers = await MDL.UserModel.getAllActiveWithRoleDeveloper(user)
        }

        // Get all developers from backend
        employeeSchedules = await getAllEmployeesWorkCalendar(developers, startMonth, endMonth, startDay)

    } else {

        let selectedEmployee = await MDL.UserModel.findById(mongoose.Types.ObjectId(employeeID)).exec()

        if (!selectedEmployee) {
            throw new AppError('Employee is not valid employee', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        }

        let employeeSchedule = await getEmployeeWorkCalendar(selectedEmployee, startMonth, endMonth, startDay)
        employeeSchedules.push(employeeSchedule)
    }

    return {
        startDay: startDay,
        heading: startMonth.format('MMMM, YY'),
        month: startMonth.month(),
        year: startMonth.year(),
        employees: employeeSchedules
    }
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
    if (employeeID && employeeID.toLowerCase() === SC.ALL) {
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