import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from "../serverconstants";
import * as EC from "../errorcodes"
import * as MDL from '../models'
import momentTZ from 'moment-timezone'
import moment from 'moment'

mongoose.Promise = global.Promise

let releaseSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: String,
        lastName: String
    },
    name: {type: String, required: [true, 'Release Version name is required']},
    status: {
        type: String,
        enum: [SC.STATUS_PLAN_REQUESTED, SC.STATUS_DEV_IN_PROGRESS, SC.STATUS_DEV_COMPLETED, SC.STATUS_RELEASED, SC.STATUS_ISSUE_FIXING, SC.STATUS_OVER]
    },
    project: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Project name is required']}
    },
    manager: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        firstName: {type: String, required: [true, 'Manager name is required']},
        lastName: String,
        email: {type: String, required: [true, 'Manager email name is required']}
    },
    leader: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        firstName: {type: String, required: [true, 'Leader name is required']},
        lastName: String,
        email: {type: String, required: [true, 'Leader email name is required']}
    },
    team: [{
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Team name is required']},
        email: {type: String, required: [true, 'Developer email name is required']}
    }],
    nonProjectTeam: [{
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Team name is required']},
        email: {type: String, required: [true, 'Developer email name is required']}
    }],
    initial: {
        billedHours: {type: Number, default: 0},
        estimatedHours: {type: Number, default: 0},
        plannedHours: {type: Number, default: 0},
        reportedHours: {type: Number, default: 0},
        estimatedHoursPlannedTasks: {type: Number, default: 0},
        estimatedHoursCompletedTasks: {type: Number, default: 0},
        plannedHoursReportedTasks: {type: Number, default: 0},
        devStartDate: Date,
        devEndDate: Date,
        clientReleaseDate: Date,
        actualReleaseDate: Date,
        maxReportedDate: Date
    },
    additional: {
        billedHours: {type: Number, default: 0},
        estimatedHours: {type: Number, default: 0},
        plannedHours: {type: Number, default: 0},
        reportedHours: {type: Number, default: 0},
        estimatedHoursPlannedTasks: {type: Number, default: 0},
        estimatedHoursCompletedTasks: {type: Number, default: 0},
        plannedHoursReportedTasks: {type: Number, default: 0},
        devStartDate: Date,
        devEndDate: Date,
        clientReleaseDate: Date,
        actualReleaseDate: Date,
        maxReportedDate: Date
    },
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
})

releaseSchema.statics.getUserHighestRoleInThisRelease = async (releaseID, user) => {
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID))
    if (release) {
        // check to see role of logged in user in this estimation
        if (release.manager && release.manager._id == user._id) {
            return SC.ROLE_MANAGER
        }
        else if (release.leader && release.leader._id == user._id) {
            return SC.ROLE_LEADER
        }
        else if (release.team && release.team.length && release.team.findIndex(t => t._id == user._id) != -1) {
            return SC.ROLE_DEVELOPER
        }
        else if (release.nonProjectTeam && release.nonProjectTeam.length && release.nonProjectTeam.findIndex(t => t._id === user._id) != -1) {
            return SC.ROLE_NON_PROJECT_DEVELOPER
        }
        else {
            let User = await MDL.UserModel.findById(user._id)
            if (User && User.roles && User.roles.length && User.roles.findIndex(role => role.name === SC.ROLE_DEVELOPER) != -1) {
                return SC.ROLE_NON_PROJECT_DEVELOPER
            } else return undefined
        }
    }
    return undefined
}

releaseSchema.statics.addRelease = async (projectAwardData, user) => {
    let releaseInput = {}
    let initial = {}
    const project = await MDL.ProjectModel.findById(projectAwardData.estimation.project._id)
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const manager = await MDL.UserModel.findOne({"_id": projectAwardData.manager._id, "roles.name": SC.ROLE_MANAGER})
    if (!manager)
        throw new AppError('Project Manager not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const leader = await MDL.UserModel.findById({"_id": projectAwardData.leader._id, "roles.name": SC.ROLE_LEADER})
    if (!leader)
        throw new AppError('Project Leader not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const projectAlreadyAwarded = await ReleaseModel.findOne({"project._id": projectAwardData.estimation.project._id})
    if (projectAlreadyAwarded)
        throw new AppError('Project already awarded', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    initial.billedHours = projectAwardData.billedHours
    initial.clientReleaseDate = projectAwardData.clientReleaseDate
    initial.devStartDate = projectAwardData.devStartDate
    initial.devEndDate = projectAwardData.devReleaseDate
    releaseInput.project = project
    releaseInput.manager = manager
    releaseInput.leader = leader
    releaseInput.team = projectAwardData.team
    releaseInput.initial = initial
    releaseInput.name = projectAwardData.releaseVersionName
    releaseInput.status = SC.STATUS_PLAN_REQUESTED
    releaseInput.user = user

    return await ReleaseModel.create(releaseInput)
}


releaseSchema.statics.getReleases = async (status, user) => {

    let filter = {}
    if (status && status.toLowerCase() != "all")
        filter = {$or: [{"manager._id": user._id}, {"leader._id": user._id}], "status": status}
    else
        filter = {$or: [{"manager._id": user._id}, {"leader._id": user._id}]}

    return await ReleaseModel.find(filter)
}

releaseSchema.statics.getReleaseById = async (releaseId, user) => {
    return await ReleaseModel.find({"_id": releaseId, $or: [{"manager._id": user._id}, {"leader._id": user._id}]})
}


//Reporting
releaseSchema.statics.getAllReportingProjects = async (user) => {
    return await MDL.ReleaseModel.find({$or: [{"manager._id": user._id}, {"leader._id": user._id}, {"team._id": user._id}, {"nonProjectTeam._id": user._id}]})
}

releaseSchema.statics.getTaskPlanedForEmployee = async (ParamsInput, user) => {
    //ParamsInput.releaseID
    //ParamsInput.planDate
    //ParamsInput.taskStatus
    let momentPlanningDate = moment(ParamsInput.planDate)
    console.log("moment(ParamsInput.planDate)", moment(ParamsInput.planDate))
    let momentPlanningDateStringToDate = momentPlanningDate.toDate()
    let momentTzPlanningDateString = momentTZ.tz(momentPlanningDateStringToDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(ParamsInput.releaseID))
    if (!release)
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    release = release.toObject()
    let taskPlans = await MDL.TaskPlanningModel.find({
        "release._id": mongoose.Types.ObjectId(ParamsInput.releaseID),
        "planningDate": momentTzPlanningDateString,
        "employee._id": mongoose.Types.ObjectId(user._id)
    })
    release.taskPlans = taskPlans
    return release
}

releaseSchema.statics.getTaskAndProjectDetails = async (taskPlanID, releaseID, user) => {
    // check release is valid or not
    if (!releaseID) {
        throw new AppError('Release id not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    let release = await MDL.ReleaseModel.findById(releaseID)
    if (!release)
        throw new AppError('Not a valid release', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)

    //check task plan is valid or not
    if (!taskPlanID) {
        throw new AppError('task plan id not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    let taskPlan = await MDL.TaskPlanningModel.findById(taskPlanID)
    if (!taskPlan)
        throw new AppError('Not a valid taskPlan', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)

    //user Role in this release to see task detail
    const userRoleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(release._id, user)
    if (!userRoleInRelease)
        throw new AppError('Not a user of this release', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    release = release.toObject()
    release.taskPlan = taskPlan

    return release

}

const ReleaseModel = mongoose.model("Release", releaseSchema)
export default ReleaseModel
/*
* let momentPlanningDate = moment(ParamsInput.planDate)
    console.log("moment(ParamsInput.planDate)", moment(ParamsInput.planDate))
    let momentPlanningDateStringToDate = momentPlanningDate.toDate()

    console.log("momentPlanningDate.toDate()", momentPlanningDate.toDate())
    let momentTzPlanningDateString = momentTZ.tz(momentPlanningDateStringToDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    console.log("momentPlanningDate Time Zone", momentTzPlanningDateString)
    let reportDate = momentTzPlanningDateString

    let matchConditionArray = []
    if (ParamsInput.projectStatus != 'all') {
        matchConditionArray.push({$match: {status: ParamsInput.projectStatus}})
    }

    matchConditionArray.push({
        $lookup: {
            from: 'taskplannings',
            localField: '_id',
            foreignField: 'release._id',
            as: 'taskPlans'
        }
    })

    console.log("reportDate", reportDate)


    //matchConditionArray.push({$unwind: {path: '$taskPlans'}})
    //matchConditionArray.push({$match: {"taskPlans.planningDate": reportDate}})
    //matchConditionArray.push({$or: [{"manager._id": user._id}, {"leader._id": user._id}, {"team._id": user._id}, {"nonProjectTeam._id": user._id}]})


    let matchTakPlanConditions = {}
    if (ParamsInput.taskStatus && ParamsInput.taskStatus.toLowerCase() != "all")
        matchTakPlanConditions = {
            "employee._id": user._id,
            "plannedDate": reportDate,
            "status": ParamsInput.taskStatus
        }
    else
        matchTakPlanConditions = {
            $or: [{"manager._id": user._id}, {"leader._id": user._id}, {"team._id": user._id}],
            "plannedDate": reportDate
        }

    let releases1 = await ReleaseModel.aggregate(matchConditionArray).exec()
    /*
    *  {
        $lookup: {
            from: 'taskplannings',
            localField: 'taskPlans._id',
            foreignField: '_id',
            as: 'taskPlans'
        }
    }, {
        $group: {
            _id: "$_id",
            created: "$created",
            planningDate: "$planningDate",
            planningDateString: "$planningDateString",
            isShifted: "$isShifted",
            canMerge: "$canMerge",
            task: "$task",
            release: "$release",
            releasePlan: "$releasePlan",
            employee: "$employee",
            flags: "$flags",
            planning: "$planning",
            report: "$report",
            taskPlans: {
                $push: {$arrayElemAt: ['$taskPlans', 0]}
            }
        }
    }*/
/*
    let releases2 = await ReleaseModel.aggregate({}, {
        $lookup: {
            from: 'taskplannings',
            let: {releaseID: "$_id"},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [
                            {$eq: ["$release._id", "$$releaseID"]},
                            {$eq: ["$planningDate", reportDate]}
                        ]
                    }
                }
            }],
            as: 'taskPlans'
        }
    }).exec()
*/