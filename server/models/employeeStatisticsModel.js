import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import * as V from '../validation'
import * as EC from '../errorcodes'
import AppError from '../AppError'

mongoose.Promise = global.Promise

let employeeStatisticsSchema = mongoose.Schema({
    release: {
        _id: mongoose.Schema.ObjectId,
        version: String
    },
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Employee name is required']},
    },
    leaves: [
        {
            startDate: {type: Date, default: Date.now()},
            endDate: {type: Date, default: Date.now()},
            reason: [{
                type: String,
                enum: [SC.REASON_MEDICAL, SC.REASON_PERSONAL, SC.REASON_OCCASION, SC.REASON_FESTIVAL]
            }],
            plannedHours: {type: Number, default: 0},
            isLastMinuteLeave: {type: Boolean, default: false},
        }
    ],
    tasks: [
        {
            _id: mongoose.Schema.ObjectId, //releasePlanId
            name: {type: String, required: [true, 'Task name is required']},
            plannedHours: {type: Number, default: 0},
            reportedHours: {type: Number, default: 0},
            plannedHoursReportedTasks: {type: Number, default: 0}
        }
    ]
})

employeeStatisticsSchema.statics.addEmployeeStatisticsDetails = async (EmployeeStatisticsInput) => {
    //console.log("EmployeeStatisticsInput", EmployeeStatisticsInput)
    V.validate(EmployeeStatisticsInput, V.employeeAddEmployeeStatisticsStruct)
    let countStatistics = await EmployeeStatisticsModel.count({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id)
    })
    if (countStatistics > 0) {
        throw new AppError('Employee statistics is already available release ' + EmployeeStatisticsInput.release.version + 'with employee ' + EmployeeStatisticsInput.employee.name + 'can not create another', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await EmployeeStatisticsModel.create(EmployeeStatisticsInput)
}


employeeStatisticsSchema.statics.addTaskDetailsToEmployeeStatistics = async (EmployeeStatisticsInput) => {
   // console.log("EmployeeStatisticsInput", EmployeeStatisticsInput)
    V.validate(EmployeeStatisticsInput, V.employeeAddTaskEmployeeStatisticsStruct)
    let countTaskStatistics = await EmployeeStatisticsModel.count({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
        "tasks._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.task._id)
    })
    if (countTaskStatistics > 0) {
        throw new AppError('Employee statistics is already available release plan ' + EmployeeStatisticsInput.task.name + ' with employee ' + EmployeeStatisticsInput.employee.name + 'can not create another', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await  await EmployeeStatisticsModel.update({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
    }, {$push: {"tasks": EmployeeStatisticsInput.task}}).exec()
}


employeeStatisticsSchema.statics.increaseTaskDetailsHoursToEmployeeStatistics = async (EmployeeStatisticsInput) => {
    //console.log("EmployeeStatisticsInput", EmployeeStatisticsInput)
    V.validate(EmployeeStatisticsInput, V.employeeUpdateTaskEmployeeStatisticsStruct)
    let employeeStatistics = await EmployeeStatisticsModel.find({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
        "tasks._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.task._id)
    })
    if (!employeeStatistics || !employeeStatistics.length) {
        throw new AppError('Employee statistics is not available', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    return await EmployeeStatisticsModel.updateOne({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
        "tasks._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.task._id)
    }, {
        $inc: {
            "tasks.$.plannedHours": Number(EmployeeStatisticsInput.task.plannedHours),
            "tasks.$.reportedHours": Number(EmployeeStatisticsInput.task.reportedHours),
            "tasks.$.plannedHoursReportedTasks": Number(EmployeeStatisticsInput.task.plannedHoursReportedTasks)
        },
    }).exec()
}


employeeStatisticsSchema.statics.decreaseTaskDetailsHoursToEmployeeStatistics = async (EmployeeStatisticsInput, user) => {
   // console.log("EmployeeStatisticsInput", EmployeeStatisticsInput)
    V.validate(EmployeeStatisticsInput, V.employeeUpdateTaskEmployeeStatisticsStruct)
    let employeeStatistics = await EmployeeStatisticsModel.find({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
        "tasks._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.task._id)
    })
    if (!employeeStatistics || !employeeStatistics.length) {
        throw new AppError('Employee statistics is not available', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    return await EmployeeStatisticsModel.updateOne({
        "employee._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.employee._id),
        "release._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.release._id),
        "tasks._id": mongoose.Types.ObjectId(EmployeeStatisticsInput.task._id)
    }, {
        $inc: {
            "tasks.$.plannedHours": -Number(EmployeeStatisticsInput.task.plannedHours),
            "tasks.$.reportedHours": -Number(EmployeeStatisticsInput.task.reportedHours),
            "tasks.$.plannedHoursReportedTasks": -Number(EmployeeStatisticsInput.task.plannedHoursReportedTasks)
        },
    }).exec()
}


employeeStatisticsSchema.statics.getActiveEmployeeStatistics = async (user) => {
    return await EmployeeStatisticsModel.find({})
}


const EmployeeStatisticsModel = mongoose.model("EmployeeStatistic", employeeStatisticsSchema)
export default EmployeeStatisticsModel

/*{

    "release": {
        "_id":"5a93c0062af17a16e808b342",
        "version": "v2.0"
    },
    "employee": {
        "_id": "5a93bf9b2af17a16e808b340",
        "name":"Gaurav agrawal"
    },
    "leaves": [
        {
            "date":"10/10/10",
            "reason":"medical",
            "plannedHours": 5,
            "isLastMinuteLeave": true
        }
    ],
    "tasks": [
        {
            "_id": "5a900ab687ccf511f8d967e6",
            "name": "Registration with faceBook",
            "plannedHours": 20,
            "reportedHours":4,
            "plannedHoursReportedTasks":5
        }
    ]
}*/