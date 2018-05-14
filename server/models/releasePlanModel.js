import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants";
import * as EC from "../errorcodes"
import * as MDL from '../models'


mongoose.Promise = global.Promise

let releasePlanSchema = mongoose.Schema({
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        estimatedHours: {type: Number, default: 0},
        initiallyEstimated: {type: Boolean, default: false}
    },
    release: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Release name is required']}
    },
    task: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: [true, 'Task name is required']},
        description: String,
        estimatedHours: {type: Number, default: 0}
    },
    feature: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    owner: {type: String, enum: [SC.OWNER_LEADER, SC.OWNER_MANAGER]},
    flags: [{
        type: String,
        enum: [SC.FLAG_UNPLANNED, SC.FLAG_PLANNED, SC.FLAG_EMPLOYEE_ON_LEAVE, SC.FLAG_DEV_DATE_MISSED, SC.FLAG_HAS_UNREPORTED_DAYS, SC.FLAG_COMPLETED_BEFORE_END_DATE, SC.FLAG_PENDING_AFTER_END_DATE]
    }],
    planning: {
        plannedHours: {type: Number, default: 0},
        minPlanningDate: Date,
        maxPlanningDate: Date,
        minPlanningDateString: String,
        maxPlanningDateString: String
    },
    report: {
        minReportedDate: Date,
        minReportedDateString: String,
        maxReportedDate: Date,
        maxReportedDateString: String,
        reportedHours: {type: Number, default: 0},
        finalStatus: {type: String, enum: [SC.STATUS_UNPLANNED, SC.STATUS_PENDING, SC.STATUS_COMPLETED]},
    },
    comments: [{
        name: {type: String, required: [true, 'Comment name is required']},
        date: {type: Date, required: [true, 'Comment date is required']},
        comment: {type: String, required: [true, 'Comment is required']},
        commentType: {
            type: String,
            enum: [SC.COMMENT_EMERGENCY, SC.COMMENT_CRITICAL, SC.COMMENT_URGENT, SC.COMMENT_REPORTING, SC.COMMENT_FYI_ONLY]
        },
    }],
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})

releasePlanSchema.statics.addReleasePlan = async (releasePlanInput) => {
    return await ReleasePlanModel.create(releasePlanInput)
}

releasePlanSchema.statics.getReleasePlansByReleaseID = async (params, user) => {
    let releaseID = params.releaseID
    let empflag = params.empflag
    let status = params.status

    if (!releaseID) {
        throw new AppError("Release Id not found ", EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID))

    if (!release) {
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (!empflag) {
        throw new AppError("Employee Flag not found ", EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    if (!status) {
        throw new AppError("Status not found ", EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }

    let filter = {"release._id": release._id}

    if (status && status.toLowerCase() != "all" && empflag && empflag.toLowerCase() != "all")
        filter = {"release._id": release._id, "report.finalStatus": status, "flags": {$in: [empflag]}}
    else if (status && status.toLowerCase() != "all")
        filter = {"release._id": release._id, "report.finalStatus": status}
    else if (empflag && empflag.toLowerCase() != "all")
        filter = {"release._id": release._id, "flags": {$in: [empflag]}}

    return await ReleasePlanModel.find(filter)
}

releasePlanSchema.statics.getReleasePlanByID = async (releasePlanID, user) => {

    if (!releasePlanID) {
        throw new AppError("release Plan  Id not found ", EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }
    return await ReleasePlanModel.findById(mongoose.Types.ObjectId(releasePlanID))
}

const ReleasePlanModel = mongoose.model("ReleasePlan", releasePlanSchema)
export default ReleasePlanModel
