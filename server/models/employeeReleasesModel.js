import mongoose from 'mongoose'

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
    leaves: {
        plannedHoursOnLeave: {type: Number, default: 0},
        plannedHoursLastMinuteLeave: {type: Number, default: 0}
    },
    report: {
        reportedHours: {type: Number, default: 0}, // Total reported hours by employee in a release
        reportedCount: {type: Number, default: 0}, // Number of task reported
        reportedAfterCount: {type: Number, default: 0},
        reportedAfterHours: {type: Number, default: 0}, // Would be noted if reported after date it was supposed to be reported
    },
    planning: {
        plannedHours: {type: Number, default: 0}, // Total planned hours against this employee in a release
        plannedCount: {type: Number, default: 0}, // Number of tasks planned
        plannedHoursReportedTasks: {type: Number, default: 0},// Total planned hours for reported tasks, good to see deviation between reported and planned hours
    },
    management: {
        before: {
            plannedHours: {type: Number, default: 0}, // Total planned hours that are planned before their dates
            plannedCount: {type: Number, default: 0}, // Number of tasks planned before their dates
            diffHours: {type: Number, default: 0}, // Diff hours from planning date
        },
        after: {
            plannedHours: {type: Number, default: 0}, // Total planned hours that are planned after their dates
            plannedCount: {type: Number, default: 0}, // Number of tasks planned after their dates
            diffHours: {type: Number, default: 0}, // Diff hours from planning date
        }
    }
})

const EmployeeReleasesModel = mongoose.model("EmployeeReleases", employeeReleasesSchema)
export default EmployeeReleasesModel
