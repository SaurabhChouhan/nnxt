import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import moment from 'moment'

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


taskPlanningSchema.statics.addTaskPlanningDetails = async (taskPlanningInput, user) => {

    if (taskPlanningInput && Array.isArray(taskPlanningInput) && taskPlanningInput.length > 0) {
        let taskPlanningPromises = taskPlanningInput.map(async task => {
            let taskPlanning = new TaskPlanningModel()
            if (!task._id) {
                taskPlanning.created = Date.now()
                taskPlanning.planningDate = moment(task.planningDate)
                taskPlanning.planningDateString = task.planningDate
                taskPlanning.task = task.task
                taskPlanning.release = task.release
                taskPlanning.releasePlan = task.releasePlan
                taskPlanning.employee = task.employee
                taskPlanning.flags = task.flags
                taskPlanning.planning = task.planning
                taskPlanning.report = task.report
                return await taskPlanning.save()
            }
            else return task
        })
        return await Promise.all(taskPlanningPromises)
    }
    else return []
}

taskPlanningSchema.statics.getTaskPlanningDetails = async (taskPlanningId, user) => {
    return await TaskPlanningModel.find({})
}
taskPlanningSchema.statics.getTaskPlanningDetailsByEmpIdAndFromDateToDate = async (employeeId, fromDate, toDate, user) => {
    console.log("taskPlanning Model", employeeId, fromDate, toDate)
    let filter = {}
    if (!employeeId)
        throw new AppError('Employee not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    filter.employee = employeeId

    //if(!fromDate && !toDate)
    // filter.planningDate = fromDate

    return await TaskPlanningModel.find(filter)
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