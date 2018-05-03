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
    return await TaskPlanningModel.find({"releasePlan._id": releaseTaskID}).sort({"planningDate": 1})
}


// Shifting task plans to future
taskPlanningSchema.statics.planningShiftToFuture = async (planning, user) => {
    //InComing Data Structure
    //planning.employeeId
    //planning.baseDate
    //planning.daysToShift
    //planning.releasePlanID


    let now = new Date()
    // Now in UTC
    let nowMoment = momentTZ.tz(now, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

// employeeId must be present or its value must be all
    if (!planning.employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// baseDate must be present
    if (!planning.baseDate)
        throw new AppError('Base Date not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// daysToShift must be present
    if (!planning.daysToShift)
        throw new AppError('days To Shift not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// releasePlanID must be present
    if (!planning.releasePlanID)
        throw new AppError('Release Plan ID not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let taskPlannings
    if (planning.employeeId == 'all') {
        // Get all employees task plannings

        taskPlannings = await TaskPlanningModel.distinct(
            "planningDate",
            {
                "releasePlan._id": planning.releasePlanID,
                "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
            })
    } else {
        // Get selected employee task plannings

        taskPlannings = await TaskPlanningModel.distinct(
            "planningDate",
            {
                "employee._id": planning.employeeId,
                "releasePlan._id": planning.releasePlanID,
                "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
            })
    }

    if (taskPlannings && taskPlannings.length) {
        taskPlannings.sort(function (a, b) {
            //  console.log("before a", a, "b", b)
            a = new Date(a);
            b = new Date(b);
            // console.log("after a", a, "b", b)
            return a < b ? -1 : a > b ? 1 : 0;
        })

        let to = moment(taskPlannings[taskPlannings.length - 1]).add(10 * planning.daysToShift, 'days')
        let daysDetails = await getWorkingDaysAndHolidays(planning.baseDate, to.toDate(), taskPlannings, user)
        // console.log("daysDetails", daysDetails)
        let taskOnHolidayCount = 0

        let ShiftingPromises = daysDetails.taskPlannings && daysDetails.taskPlannings.length ? daysDetails.taskPlannings.map(async PlanningDate => {
            // calculating index of working day list where planning date and working date is same
            let PlanningDateMoment = momentTZ.tz(PlanningDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

            let index = daysDetails.AllWorkingDayList && daysDetails.AllWorkingDayList.length ? daysDetails.AllWorkingDayList.findIndex(wd => wd.isSame(moment(PlanningDate))) : -1
            if (index != -1) {
                //if true then  plannig must have done in working days

                // console.log("(index + taskOnHolidayCount + planning.daysToShift)", Number(Number(index) + Number(taskOnHolidayCount) + Number(planning.daysToShift)))
                let newShiftingDate = daysDetails.AllWorkingDayList[Number(Number(index) + Number(taskOnHolidayCount) + Number(planning.daysToShift))]

                console.log("PlanningDate", moment(PlanningDate), "->", "newShiftingDate", newShiftingDate)
                // updating Task planning to proper date
                if (planning.employeeId == 'all') {
                    // task planning of all employee will shift

                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}).exec()
                } else {
                    // task planning of selected employee will shift

                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "employee._id": planning.employeeId,
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}).exec()
                }
            } else if (daysDetails.AllTasksOnHolidayList && daysDetails.AllTasksOnHolidayList.length && daysDetails.AllTasksOnHolidayList.findIndex(wd => wd.date.isSame(moment(PlanningDate))) != -1) {
                //else  plannig must have done in holidays
                // calculating index of holiday where planning date and holiday  date are same
                index = daysDetails.AllTasksOnHolidayList.findIndex(wd => wd.date.isSame(PlanningDateMoment))


                //  console.log("taskOnHolidayCount", taskOnHolidayCount)
                // console.log("index", index)
                //  console.log("daysDetails.AllTasksOnHolidayList[index].index", daysDetails.AllTasksOnHolidayList[index].index)
                //  console.log("daysDetails.AllTasksOnHolidayList[index]", daysDetails.AllTasksOnHolidayList[index])
                // console.log("planning.daysToShift", planning.daysToShift)
                //console.log("(taskOnHolidayCount + daysDetails.AllTasksOnHolidayList[index].index + planning.daysToShift)", Number(Number(taskOnHolidayCount) + Number(daysDetails.AllTasksOnHolidayList[index].index) + Number(planning.daysToShift)))

                //new Shifting date where task has to be placed
                let newShiftingDate = daysDetails.AllWorkingDayList[Number(Number(taskOnHolidayCount) + Number(daysDetails.AllTasksOnHolidayList[index].index) + Number(planning.daysToShift))]
                console.log("PlanningDate", PlanningDateMoment, "->", "newShiftingDate", newShiftingDate, "holiday \n")
                taskOnHolidayCount++
                // updating Task planning to proper date
                if (planning.employeeId == 'all') {
                    // task planning of all employee will shift
                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}
                    ).exec()
                } else {
                    // task planning of selected employee will shift
                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "employee._id": planning.employeeId,
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}
                    ).exec()
                }


            } else {
                //System inconsistency
                throw new AppError('System inconsistency planning is neither on working days nor holidays ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
            }
        }) : new Promise((resolve, reject) => {
            return resolve(false)
        })
        await Promise.all(ShiftingPromises).then(async promise => {
            return await TaskPlanningModel.update({"releasePlan._id": planning.releasePlanID}, {$set: {"isShifted": false}}, {multi: true}).exec()
        })

    } else {
        throw new AppError('No task available to shift', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    return planning
}


// Shifting task plans to past
taskPlanningSchema.statics.planningShiftToPast = async (planning, user) => {
    //InComing Data Structure
    //planning.employeeId
    //planning.baseDate
    //planning.daysToShift
    //planning.releasePlanID


    let now = new Date()
    // Now in UTC
    let nowMoment = momentTZ.tz(now, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

// employeeId must be present or its value must be all
    if (!planning.employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// baseDate must be present
    if (!planning.baseDate)
        throw new AppError('Base Date not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// daysToShift must be present
    if (!planning.daysToShift)
        throw new AppError('days To Shift not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

// releasePlanID must be present
    if (!planning.releasePlanID)
        throw new AppError('Release Plan ID not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)


    let taskPlannings
    if (planning.employeeId == 'all') {
        // Get all employees task plannings

        taskPlannings = await TaskPlanningModel.distinct(
            "planningDate",
            {
                "releasePlan._id": planning.releasePlanID,
                "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
            })
    } else {
        // Get selected employee task plannings

        taskPlannings = await TaskPlanningModel.distinct(
            "planningDate",
            {
                "employee._id": planning.employeeId,
                "releasePlan._id": planning.releasePlanID,
                "planningDate": {$gte: momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)}
            })
    }
    // console.log("taskPlannings", taskPlannings)

    if (taskPlannings && taskPlannings.length) {

        taskPlannings.sort(function (a, b) {
            //  console.log("before a", a, "b", b)
            a = new Date(a);
            b = new Date(b);
            // console.log("after a", a, "b", b)
            return a < b ? -1 : a > b ? 1 : 0;
        })

        let daysToShiftPast = Number(planning.daysToShift)

        let startShiftingDateMoment = momentTZ.tz(taskPlannings[0], SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        let startShiftingDate = startShiftingDateMoment.subtract(daysToShiftPast, "days")
        // Can not shift task plannings before now
        if (startShiftingDate.isBefore(nowMoment)) {
            throw new AppError('Can not shift before now ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        } else {
            let priviousDaysDetails = await getWorkingDaysAndHolidays(moment(taskPlannings[taskPlannings.length - 1]).subtract(10 * daysToShiftPast, 'days'), momentTZ.tz(taskPlannings[0], SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0))
            //console.log("priviousDaysDetails", priviousDaysDetails)
            let idx = priviousDaysDetails.AllWorkingDayList.findIndex(wd => wd.isSame(momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)))
            let idx2 = priviousDaysDetails.AllTasksOnHolidayList.findIndex(wd => wd.isSame(momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)))
            if (idx != -1 && idx > daysToShiftPast && priviousDaysDetails.AllWorkingDayList[Number(idx - daysToShiftPast)].isBefore(nowMoment)) {

                throw new AppError('Can not shift because less working days available for task shifting ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
            } else if (idx2 != -1 && priviousDaysDetails.AllWorkingDayList[Number(Number(priviousDaysDetails.AllTasksOnHolidayList[idx2].index) - daysToShiftPast)].isBefore(nowMoment)) {
                throw new AppError('Can not shift because less working days available for task shifting and In holiday also tasks are planned', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
            } else {

                if (idx != -1) {
                    startShiftingDate = priviousDaysDetails.AllWorkingDayList[Number(idx - daysToShiftPast)]
                } else if (idx2 != -1) {
                    startShiftingDate = priviousDaysDetails.AllWorkingDayList[Number(Number(priviousDaysDetails.AllTasksOnHolidayList[idx2].index) - daysToShiftPast)]
                }
            }
        }
        // console.log("startShiftingDate", startShiftingDate)
        let to = moment(taskPlannings[taskPlannings.length - 1]).add(10 * planning.daysToShift, 'days')

        let daysDetails = await getWorkingDaysAndHolidays(startShiftingDate.toDate(), to.toDate(), taskPlannings, user)
        //  console.log("daysDetails", daysDetails)
        let taskOnHolidayCount = 0

        let ShiftingPromises = daysDetails.taskPlannings && daysDetails.taskPlannings.length ? daysDetails.taskPlannings.map(async PlanningDate => {
            // calculating index of working day list where planning date and working date is same
            let PlanningDateMoment = momentTZ.tz(PlanningDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

            let index = daysDetails.AllWorkingDayList && daysDetails.AllWorkingDayList.length ? daysDetails.AllWorkingDayList.findIndex(wd => wd.isSame(moment(PlanningDate))) : -1
            if (index != -1) {
                //if true then  planing must have done in working days

                // console.log("taskOnHolidayCount", taskOnHolidayCount)
                // console.log("Number(Number(index)", Number(Number(index)))
                //  console.log("daysDetails.AllTasksOnHolidayList[index].index",)
                //   console.log(" Number(planning.daysToShift)", Number(planning.daysToShift))
                //    console.log("planning.daysToShift", planning.daysToShift)
                //   console.log("Number(Number(index) + Number(taskOnHolidayCount) - Number(planning.daysToShift))", Number(Number(index) + Number(taskOnHolidayCount) - Number(planning.daysToShift)))
                //   console.log("newShiftingDate", daysDetails.AllWorkingDayList[Number(Number(index) + Number(taskOnHolidayCount))])

                let newShiftingDate = daysDetails.AllWorkingDayList[Number(Number(index) + Number(taskOnHolidayCount) - Number(planning.daysToShift))]

                console.log("PlanningDate", moment(PlanningDate), "->", "newShiftingDate", newShiftingDate)
                // updating Task planning to proper date
                if (planning.employeeId == 'all') {
                    // task planning of all employee will shift

                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}).exec()
                } else {
                    // task planning of selected employee will shift

                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "employee._id": planning.employeeId,
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}).exec()
                }
            } else if (daysDetails.AllTasksOnHolidayList && daysDetails.AllTasksOnHolidayList.length && daysDetails.AllTasksOnHolidayList.findIndex(wd => wd.date.isSame(moment(PlanningDate))) != -1) {
                //else  plannig must have done in holidays
                // calculating index of holiday where planning date and holiday  date are same
                index = daysDetails.AllTasksOnHolidayList.findIndex(wd => wd.date.isSame(PlanningDateMoment))


                //  console.log("holiday taskOnHolidayCount", taskOnHolidayCount)
                //   console.log("holiday index", index)
                //   console.log("holiday daysDetails.AllTasksOnHolidayList[index].index", daysDetails.AllTasksOnHolidayList[index].index)
                ////  console.log("holiday daysDetails.AllTasksOnHolidayList[index]", daysDetails.AllTasksOnHolidayList[index])
                //  console.log("holiday planning.daysToShift", planning.daysToShift)
                //   console.log("holiday (taskOnHolidayCount + daysDetails.AllTasksOnHolidayList[index].index + planning.daysToShift)", Number(Number(taskOnHolidayCount) + Number(daysDetails.AllTasksOnHolidayList[index].index) - Number(planning.daysToShift)))

                //new Shifting date where task has to be placed
                let newShiftingDate = daysDetails.AllWorkingDayList[Number(Number(taskOnHolidayCount) + Number(daysDetails.AllTasksOnHolidayList[index].index) - Number(planning.daysToShift))]
                console.log("PlanningDate", PlanningDateMoment, "->", "newShiftingDate", newShiftingDate, "holiday \n")
                taskOnHolidayCount++
                // updating Task planning to proper date
                if (planning.employeeId == 'all') {
                    // task planning of all employee will shift
                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}
                    ).exec()
                } else {
                    // task planning of selected employee will shift
                    return await TaskPlanningModel.update({
                            "releasePlan._id": planning.releasePlanID,
                            "planningDate": PlanningDateMoment.clone(),
                            "employee._id": planning.employeeId,
                            "isShifted": false
                        },
                        {
                            $set: {
                                "planningDate": newShiftingDate.clone(),
                                "isShifted": true
                            }
                        }, {multi: true}
                    ).exec()
                }


            } else {
                //System inconsistency
                throw new AppError('System inconsistency planning is neither on working days nor holidays ', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
            }
        }) : new Promise((resolve, reject) => {
            return resolve(false)
        })

        await Promise.all(ShiftingPromises).then(async promise => {
            return await TaskPlanningModel.update({"releasePlan._id": planning.releasePlanID}, {$set: {"isShifted": false}}, {multi: true}).exec()
        })

    } else {
        throw new AppError('No task available to shift', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    return planning
}

// to calculate working days and holidays
const getWorkingDaysAndHolidays = async (from, to, taskPlannings, user) => {
    // call to holiday model to get holiday lists
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
    } else if (holidays && holidays.length) {
        holidayObjectList = holidays[0].holidays
    } else {
        //No holiday available to this list
    }
    // console.log("holidayObjectList", holidayObjectList)
    // Converting holiday Object List to Date with UTC moment
    let holidayDateList = _.map(holidayObjectList, function (obj) {
        return momentTZ.tz(obj.date, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0);
    })


    //  console.log("holidayDateList", holidayDateList)
    //Getting All Dates, AllWorkingDayList, AllTasksOnHolidayList, object ,Arrays and other Fields after calculation
    return await getDates(from, to, taskPlannings, holidayDateList);

}


// to calculate working days and Task on holidays
const getDates = async (from, to, taskPlannings, holidayList) => {
    let fromMoment = momentTZ.tz(from, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let toMoment = momentTZ.tz(to, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let AllDateList = []
    let AllWorkingDayList = []
    let AllTasksOnHolidayList = []
    while (fromMoment.isSameOrBefore(toMoment.clone())) {
        AllDateList.push(fromMoment.clone())
        if (holidayList && holidayList.length && holidayList.findIndex(obj => momentTZ.tz(obj, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSame(fromMoment.clone())) == -1) {
            //Date is not awailable in holiday list so it is included in working day list
            AllWorkingDayList.push(fromMoment.clone())
        } else if (taskPlannings && taskPlannings.length && taskPlannings.findIndex(obj => momentTZ.tz(obj, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isSame(fromMoment.clone())) != -1) {
            //Date is holiday date and awailable in taskPlanning list so it is included in AllTasksOnHolidayList
            AllTasksOnHolidayList.push({date: fromMoment, index: AllWorkingDayList.length})
        }
        // increment of date
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