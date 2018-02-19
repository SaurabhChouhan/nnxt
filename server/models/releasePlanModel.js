import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants";
import {userHasRole} from "../utils"
import * as EC from "../errorcodes"
import * as V from "../validation"
import {EstimationModel} from "./"
import _ from 'lodash'

mongoose.Promise = global.Promise

let releasePlanSchema = mongoose.Schema({
    estimation: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        estimatedHours:{type: Number, default:0},
        initiallyEstimated:{type: Boolean, default:false}
    },
    release: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name:{type: String, required: [true, 'Release name is required']}
    },
    task: {
        _id: mongoose.Schema.ObjectId,
        name:String
    },
    feature: {
        _id: mongoose.Schema.ObjectId,
        name:String
    },
    owner: {type: String, enum: [SC.OWNER_LEADER,SC.OWNER_MANAGER]},
    flags: [{type: String, enum: [SC.FLAG_UNPLANNED,SC.FLAG_EMPLOYEE_ON_LEAVE,SC.FLAG_DEV_DATE_MISSED,SC.FLAG_HAS_UNREPORTED_DAYS,SC.FLAG_COMPLETED_BEFORE_END_DATE,SC.FLAG_PENDING_AFTER_END_DATE]}],
    planning: {
        plannedHours:{type: Number, default: 0},
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
        reportedHours:{type: Number, default: 0},
        finalStatus: {type: String, enum: [SC.STATUS_PENDING,SC.STATUS_COMPLETED]},
    },
    comments:[{
        name : {type: String, required: [true, 'Comment name is required']},
        date:{type: Date, required: [true, 'Comment date is required']},
        comment:{type: String, required: [true, 'Comment is required']}
    }],
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})

releasePlanSchema.statics.addReleasePlan = async (releasePlanInput) => {
        return  await ReleasePlanModel.create(releasePlanInput)
}

releasePlanSchema.statics.getReleasePlansByReleaseID = async (releaseID,user) => {
    if (!user || (!userHasRole(user, SC.ROLE_NEGOTIATOR)))
        throw new AppError('Only user with of the roles [' + SC.ROLE_NEGOTIATOR + '] can get projects releases', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    return await ReleasePlanModel.find({"release._id" : releaseID})
}

const ReleasePlanModel = mongoose.model("ReleasePlan", releasePlanSchema)
export default ReleasePlanModel
