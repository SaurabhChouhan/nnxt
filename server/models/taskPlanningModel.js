import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import * as EC from '../errorcodes'
import {ReleasePlanModel} from '../models'

mongoose.Promise = global.Promise

let taskPlanningSchema = mongoose.Schema({
    created: {type: Date, default: Date.now()},
    planningDate: {type: Date, default: Date.now()},
    planningDateString: String,
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

    await  ReleasePlanModel.update({"_id": taskPlanningInput.releasePlan._id}, {"flags": [SC.FLAG_PLANNED]})
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

    if (!planning.employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

//    planning.employeeId
//    planning.baseDate
//    planning.daysToShift
//    planning.taskID

    if (planning.employeeId == 'all') {
        await TaskPlanningModel.update({
                "releasePlan._id": planning.releasePlanID,
                "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
            },
            {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).add("days", planning.daysToShift)}}, {multi: true}
        ).exec()
    } else {
        await TaskPlanningModel.update({
                "releasePlan._id": planning.releasePlanID,
                "planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0),
                "employee._id": planning.employeeId
            },
            {$set: {"planningDate": momentTZ.tz(planning.baseDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).add("days", planning.daysToShift)}}, {multi: true}
        ).exec()

    }


    return planning
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