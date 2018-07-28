import mongoose from 'mongoose'
import * as V from '../validation'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import AppError from '../AppError'
import * as MDL from '../models'

mongoose.Promise = global.Promise

/**
 * Keeps summarized information of work done by employee in a release
 */
let employeeReleasesSchema = mongoose.Schema({
    employee: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Employee name is required']},
    },
    release: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Release name is required']}
    },
    // Total planned hours against this employee in a release
    plannedHours: {type: Number, default: 0},
    // Total reported hours by employee in a release
    reportedHours: {type: Number, default: 0},
    // Total planned hours for reported tasks, good to see deviation between reported and planned hours
    plannedHoursReportedTasks: {type: Number, default: 0},
    leaves: [{
        date: {type: Date, default: Date.now()},
        reason: [{
            type: String,
            enum: [SC.REASON_MEDICAL, SC.REASON_PERSONAL, SC.REASON_OCCASION, SC.REASON_FESTIVAL]
        }],
        plannedHours: {type: Number, default: 0},
        isLastMinuteLeave: {type: Boolean, default: false}
    }]
})


const EmployeeReleasesModel = mongoose.model("EmployeeReleases", employeeReleasesSchema)
export default EmployeeReleasesModel
