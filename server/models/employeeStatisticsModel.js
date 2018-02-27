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

const EmployeeStatisticsModel = mongoose.model("EmployeeDays", employeeStatisticsSchema)
export default EmployeeStatisticsModel

