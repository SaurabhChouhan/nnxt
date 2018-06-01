import mongoose from 'mongoose'
import * as SC from '../serverconstants'
import * as U from '../utils'
import logger from '../logger'

mongoose.Promise = global.Promise

let warningSchema = mongoose.Schema({
    type: {
        type: String,
        enum: SC.ALL_WARNING_NAME_ARRAY
    },
    releases: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId,
        source: Boolean
    }],
    employeeDays: [{
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId
        },
        dateString: String,
        date: {type: Date, default: Date.now()},
    }],
    raisedOn: {type: Date, default: Date.now()},
    mute: {type: Boolean, default: false}
}, {
    usePushEach: true
})


warningSchema.statics.addUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // unplanned warning would be raised against a single release and a single release plan
    var warning = {}
    warning.type = SC.WARNING_UNPLANNED
    warning.releases = [{
        _id: mongoose.Types.ObjectId(releasePlan.release._id),
 source: true
    }]
    warning.releasePlans = [{
        _id: mongoose.Types.ObjectId(releasePlan._id),
source: true
    }]
    /*
      I have not intentionally checked for existence of warning as duplicate warning would not cause
      much problem and any such duplicate warning would be visible on UI and duplicate calls would be
      fixed. This would save un-necessary existence check of warnings
     */

    return await WarningModel.create(warning)
}

warningSchema.statics.addToManyHours = async (toManyHoursWarningInput) => {
    // TODO: Add appropriate validation
    /*
 let toManyHoursWarningInput = {
    release: {
        _id: release._id.toString(),
        source: true
    },
    releasePlan: {
        _id: releasePlan._id.toString(),
        source: true
    },
    taskPlan: {
        _id: taskPlanning._id.toString(),
        source: true
    },
    employeeDay: {
        _id: employeeDays._id.toString(),
        employee: {
            _id: employeeDays.employee._id.toString()
        },
        dateString: employeeDays.dateString
    }
}*/
    let warning = await WarningModel.findOne({
        type: SC.WARNING_TOO_MANY_HOURS,
        'employeeDay.date': U.dateInUTC(toManyHoursWarningInput.employeeDay.dateString),
        'employeeDay.employee_id': U.dateInUTC(toManyHoursWarningInput.employeeDay.employee._id)
    })

    logger.debug('Existing warning to many hours ', {warning})

    if (warning) {
        warning = warning.toObject()
        let releaseAlreadyAdded = false
        if (warning.releases && Array.isArray(warning.releases) && warning.releases.length && warning.toObject().releases.indexOf((r) => {
                return r._id == toManyHoursWarningInput.release._id
            }) == -1) {
            warning.releases.push({_id: toManyHoursWarningInput.release._id})
        }

        if (warning.releasePlans && Array.isArray(warning.releasePlans) && warning.releasePlans.length && warning.toObject().releasePlans.indexOf((r) => {
                return r._id == toManyHoursWarningInput.releasePlan._id
            }) == -1) {
            warning.releasePlans.push({_id: toManyHoursWarningInput.releasePlan._id})
        }
        return await warning.save()
    } else {
        return await WarningModel.create(toManyHoursWarningInput)
    }
}


warningSchema.statics.removeUnplanned = async (releasePlan) => {
    // TODO: Add appropriate validation
    // remove unplanned warning from release plan
    return await WarningModel.remove({
        type: SC.WARNING_UNPLANNED,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })
}

warningSchema.statics.addPendingOnEndDate = async (releasePlan, taskPlan) => {
    // Find if this warning is already raised for this release plan
    let warning = await WarningModel.findOne({
        type: SC.WARNING_PENDING_ON_END_DATE,
        'releasePlans._id': mongoose.Types.ObjectId(releasePlan._id)
    })

    logger.debug('Existing warning pending on end date ', {warning})

    if (warning) {
        var releaseAlreadyAdded = false
        if (warning.releases) {
            releaseAlreadyAdded = warning.releases.filter(r => {
                return r._id.toString() == releasePlan.release._id.toString()
            }).length > 0
        }

        logger.debug('release already added ['+releaseAlreadyAdded+']')
        if (!releaseAlreadyAdded && warning.releases && warning.toObject().releases.indexOf((r) => {
                return r._id == releasePlan.release._id
            }) == -1)
            warning.releases.push({_id: releasePlan.release._id})

        var releasePlanAlreadyAdded = false
        if (warning.releasePlans) {
            releasePlanAlreadyAdded = warning.releasePlans.filter(r => {
                return r._id.toString() == releasePlan._id.toString()
            }).length > 0
        }

        logger.debug('release plan already added ['+releasePlanAlreadyAdded+']')

        if (!releasePlanAlreadyAdded && warning.releasePlans && warning.releasePlans.indexOf((r) => r._id == releasePlan._id) == -1)
            warning.releasePlans.push({_id: releasePlan._id})

        var taskPlanAlreadyAdded = false
        if (warning.taskPlans) {
            taskPlanAlreadyAdded = warning.taskPlans.filter(t => {
                return t._id.toString() == taskPlan._id.toString()
            }).length > 0
        }

        logger.debug('task plan already added ['+taskPlanAlreadyAdded+']')

        if (!taskPlanAlreadyAdded && warning.taskPlans && warning.taskPlans.indexOf((t) => t._id == taskPlan._id) == -1)
            warning.taskPlans.push({_id: taskPlan._id})

        return await warning.save()

    } else {
        warning = {}
        warning.type = SC.WARNING_PENDING_ON_END_DATE
        warning.releases = [{
            _id: releasePlan.release._id,
            source: true
        }]
        warning.releasePlans = [{
            _id: releasePlan._id,
            source: true
        }]

        warning.taskPlans = [{
            _id: taskPlan._id,
            source: true
        }]
        return await WarningModel.create(warning)
    }
}

const WarningModel = mongoose.model('Warning', warningSchema)
export default WarningModel
