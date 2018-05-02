import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import momentTZ from 'moment-timezone'
import _ from 'lodash'
import moment from 'moment'
import * as EC from '../errorcodes'
import * as MDL from '../models'

mongoose.Promise = global.Promise

let taskPlanningSchema = mongoose.Schema({
    created: {type: Date, default: Date.now()},
    planningDate: {type: Date, default: Date.now()},
    planningDateString: String,
    isShifted: {type: Boolean, default: false},
    task: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Task name is required']},
    },
    release: {
        _id: mongoose.Schema.ObjectId,
    },
    releasePlan: {
        _id: mongoose.Schema.ObjectId,
    },
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'employee name is required']},
    },
    flags: [{
        type: String,
        enum: [SC.FLAG_EMPLOYEE_ON_LEAVE, SC.REPORT_UNREPORTED]
    }],
    planning: {
        plannedHours: {type: Number, default: 0}
    },
    report: {
        status: {
            type: String,
            enum: [SC.REPORT_UNREPORTED, SC.REPORT_COMPLETED, SC.REPORT_PENDING]

        },
        reasons: [{
            type: String,
            enum: [SC.REASON_GENRAL_DELAY, SC.REASON_EMPLOYEE_ON_LEAVE, SC.REASON_INCOMPLETE_DEPENDENCY, SC.REASON_NO_GUIDANCE_PROVIDED, SC.REASON_RESEARCH_WORK, SC.REASON_UNFAMILIAR_TECHNOLOGY]
        }],
        reportedHours: {type: Number, default: 0}
    }
})


taskPlanningSchema.statics.addTaskPlanning = async (taskPlanningInput, user) => {
    if (!taskPlanningInput.releasePlan._id) {
        throw new AppError('ReleasePlan not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    await  MDL.ReleasePlanModel.update({"_id": taskPlanningInput.releasePlan._id}, {"flags": [SC.FLAG_PLANNED]})
    let taskPlanning = new TaskPlanningModel()
    taskPlanning.created = Date.now()
    taskPlanning.planningDate = momentTZ.tz(taskPlanningInput.planningDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    taskPlanning.planningDateString = taskPlanningInput.planningDate
    taskPlanning.task = taskPlanningInput.task
    taskPlanning.release = taskPlanningInput.release
    taskPlanning.releasePlan = taskPlanningInput.releasePlan
    taskPlanning.employee = taskPlanningInput.employee
    taskPlanning.flags = taskPlanningInput.flags
    taskPlanning.planning = taskPlanningInput.planning
    taskPlanning.report = taskPlanningInput.report

    return await taskPlanning.save()

}

taskPlanningSchema.statics.deleteTaskPlanning = async (taskPlanID, user) => {
    return await TaskPlanningModel.remove({"_id": taskPlanID})

}

taskPlanningSchema.statics.getReleaseTaskPlanningDetails = async (releaseTaskID, user) => {
    return await TaskPlanningModel.find({"releasePlan._id": releaseTaskID})
}

taskPlanningSchema.statics.planningShiftToFuture = async (planning, user) => {

//    planning.employeeId
//    planning.baseDate
//    planning.daysToShift
//    planning.releasePlanID

    let taskPlannings = await TaskPlanningModel.distinct(
        "planningDate",
        {
            "employee._id": planning.employeeId,
            "releasePlan._id": planning.releasePlanID,
            "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
        }
    )
    // console.log("taskPlannings", taskPlannings)

    taskPlannings.sort(function (a, b) {
        //  console.log("before a", a, "b", b)
        a = new Date(a);
        b = new Date(b);
        // console.log("after a", a, "b", b)
        return a < b ? -1 : a > b ? 1 : 0;
    })
    let to = moment(taskPlannings[taskPlannings.length - 1]).add(10 * planning.daysToShift, 'days')
    // console.log("taskPlannings after sort", taskPlannings)
    if (taskPlannings && taskPlannings.length) {
        let daysDetails = await getWorkingDaysAndHolidays(planning.baseDate, to.toDate(), taskPlannings, user)
        console.log("daysDetails", daysDetails)
    }


    return planning
}
const getWorkingDaysAndHolidays = async (from, to, taskPlannings, user) => {
    let holidays = await MDL.YearlyHolidaysModel.getAllYearlyHolidaysBaseDateToEnd(from, to, user)
    // console.log("holidays", holidays)
    let i = 0
    let holidayObjectList
    if (holidays && holidays.length && holidays.length > 1) {
        holidayObjectList = holidays[0].holidays
        while (i < holidays.length - 1) {
            holidayObjectList.concat(holidays[i + 1])
            i++
        }
    } else {
        holidayObjectList = holidays[0].holidays
    }
    // console.log("holidayObjectList", holidayObjectList)
    let holidayDateList = _.map(holidayObjectList, function (obj) {
        return momentTZ.tz(obj.date, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0);
    })
    //  console.log("holidayDateList", holidayDateList)

    return await getDates(from, to, taskPlannings, holidayDateList);

}


const getDates = async (from, to, taskPlannings, holidayList) => {
    let fromMoment = momentTZ.tz(from, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let toMoment = momentTZ.tz(to, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let AllDateList = []
    let AllWorkingDayList = []
    let AllTasksOnHolidayList = []
    while (fromMoment.isSameOrBefore(toMoment.clone())) {
        AllDateList.push(fromMoment.clone())
        if (holidayList && holidayList.length && holidayList.findIndex(obj => momentTZ.tz(obj, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSame(fromMoment.clone())) == -1) {

            AllWorkingDayList.push(fromMoment.clone())
        } else if (taskPlannings && taskPlannings.length && taskPlannings.findIndex(obj => momentTZ.tz(obj, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSame(fromMoment.clone())) != -1) {

            AllTasksOnHolidayList.push({date: fromMoment, index: AllWorkingDayList.length})
        }
        fromMoment = fromMoment.clone().add(1, 'days')
    }
    //  console.log("AllDateList", AllDateList)
    //  console.log("AllWorkingDayList", AllWorkingDayList)
    //  console.log("AllTasksOnHolidayList", AllTasksOnHolidayList)
    return {
        AllTasksOnHolidayList,
        AllWorkingDayList,
        AllDateList,
        from,
        to,
        taskPlannings,
        holidayList
    }

}
taskPlanningSchema.statics.planningShiftToPast = async (planning, user) => {

    if (!planning.employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

//    planning.employeeId
//    planning.baseDate
//    planning.daysToShift
//    planning.releasePlanID

    if (planning.employeeId == 'all') {
        await TaskPlanningModel.update({
                "releasePlan._id": planning.releasePlanID,
                "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
            },
            {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).subtract("days", planning.daysToShift)}}, {multi: true}
        ).exec()
    } else {
        await TaskPlanningModel.update({
                "releasePlan._id": planning.releasePlanID,
                "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0),
                "employee._id": planning.employeeId
            },
            {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).subtract("days", planning.daysToShift)}}, {multi: true}
        ).exec()

    }
    return planning
}

taskPlanningSchema.statics.getTaskPlanningDetailsByEmpIdAndFromDateToDate = async (employeeId, fromDate, toDate, user) => {
    if (!employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    let toDateMoment
    let fromDateMoment

    if (fromDate && fromDate != 'undefined' && fromDate != undefined) {
        fromDateMoment = moment(fromDate).hour(0).minute(0).second(0).millisecond(0)
    }
    if (toDate && toDate != 'undefined' && toDate != undefined) {
        toDateMoment = moment(toDate).minute(0).second(0).millisecond(0)
    }



    let taskPlannings = await TaskPlanningModel.find({"employee._id": employeeId})
    if (fromDate && fromDate != 'undefined' && fromDate != undefined && toDate && toDate != 'undefined' && toDate != undefined) {
        taskPlannings = taskPlannings.filter(tp => momentTZ.tz(tp.planningDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSameOrAfter(fromDateMoment) && momentTZ.tz(tp.planningDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSameOrBefore(toDateMoment))
    }
    else if (fromDate && fromDate != 'undefined' && fromDate != undefined) {
        taskPlannings = taskPlannings.filter(tp => momentTZ.tz(tp.planningDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSameOrAfter(fromDateMoment))
    }
    else if (toDate && toDate != 'undefined' && toDate != undefined) {
        taskPlannings = taskPlannings.filter(tp => momentTZ.tz(tp.planningDateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSameOrBefore(toDateMoment))
    }
    return taskPlannings
}


const TaskPlanningModel = mongoose.model("TaskPlanning", taskPlanningSchema)
export default TaskPlanningModel


/*
[{

    "dateString": "10/10/10",
    "task": {
        "_id": "5a900ab687ccf511f8d967e6",
        "name": "Registration with faceBook"
    },
    "release": {
        "_id": "5a93c0062af17a16e808b342"
    },
    "employee": {
        "_id": "5a8fc06a6f655c1e84360a2d",
        "name": "negotiator 1"
    },
    "flags": "un-reported",
    "planning": {
        "plannedHours": 20
    },
    "report": {
        "status": "un-reported",
        "reasons": "general-delay",
        "reportedHours": 2
    }
}]
*/


/*
*  Shift to future
*  let taskPlannings
    let endDateOfThePlanning
    let holidaysAfterBaseDate
    let allTaskPlannedDates
    let occupiedDates = []
    if (!planning.employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


//    planning.employeeId
//    planning.baseDate
//    planning.daysToShift
//    planning.releasePlanID

    if (planning.employeeId == 'all') {
        await TaskPlanningModel.update({
                "releasePlan._id": planning.releasePlanID,
                "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
            },
            {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).add("days", planning.daysToShift)}}, {multi: true}
        ).exec()
    } else {

        taskPlannings = await TaskPlanningModel.find(
            {
                "employee._id": planning.employeeId,
                "releasePlan._id": planning.releasePlanID,
                "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
            },
            {"planningDate": 1, "_id": 0}
        ).sort({"planningDate": 1})

        console.log("taskPlannings", taskPlannings)
        if (taskPlannings && taskPlannings.length) {
            let nextDate = momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).add(planning.daysToShift, 'days')
            console.log("nextDate", nextDate)
            console.log("taskPlannings[taskPlannings.length - 1]", taskPlannings[taskPlannings.length - 1])
            console.log("taskPlannings[taskPlannings.length - 1]", taskPlannings[taskPlannings.length - 1].planningDate)
            endDateOfThePlanning = taskPlannings[taskPlannings.length - 1].planningDate
            holidaysAfterBaseDate = await MDL.YearlyHolidaysModel.getAllYearlyHolidaysBaseDateToEnd(planning.baseDate, user)
            console.log("holidaysAfterBaseDate", holidaysAfterBaseDate)
            let dateArray = _.uniq(taskPlannings, 'planningDate');

            console.log("dateArray", dateArray)
            let prevDate
            let dateShiftingPromise = dateArray.map(async Date => {
                moment(prevDate).diff(moment(Date.planningDate), 'days')
                let shifting = true
                while (shifting) {
                    if (_.includes(holidaysAfterBaseDate, nextDate) || _.includes(occupiedDates, nextDate)) {
                        nextDate = nextDate.add(1, 'days')
                    }
                    else {
                        occupiedDates.push(nextDate)
                        shifting = false
                        await TaskPlanningModel.updateMany({
                            "planningDate": Date.planningDate,
                            "isShifted": false
                        }, {
                            "planningDate": nextDate,
                            "isShifted": true
                        }, {multi: true}).exec()
                        nextDate = nextDate.add(1, 'days')
                        prevDate = Date.planningDate
                    }
                }
            })
            await Promise.all(dateShiftingPromise)


        }


           await TaskPlanningModel.update({
                   "releasePlan._id": planning.releasePlanID,
                   "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0),
                   "employee._id": planning.employeeId
               },
               {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).add("days", planning.daysToShift)}}, {multi: true}
           ).exec()


}

*/