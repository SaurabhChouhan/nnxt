import mongoose from 'mongoose'
import * as SC from '../serverconstants'

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
            date: {type: Date, default: Date.now()},
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
            _id: mongoose.Schema.ObjectId,
            name: {type: String, required: [true, 'Task name is required']},
            plannedHours: {type: Number, default: 0},
            reportedHours: {type: Number, default: 0},
            plannedHoursReportedTasks: {type: Number, default: 0}
        }
    ]
})

employeeStatisticsSchema.statics.addEmployeeStatisticsDetails = async (EmployeeStatisticsInput,user) => {
    return await EmployeeStatisticsModel.create(EmployeeStatisticsInput)
}

employeeStatisticsSchema.statics.getActiveEmployeeStatistics = async (user) => {
    return await EmployeeStatisticsModel.find({})
}

const EmployeeStatisticsModel = mongoose.model("EmployeeStatistics", employeeStatisticsSchema)
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