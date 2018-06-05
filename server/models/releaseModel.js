import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import momentTZ from 'moment-timezone'
import logger from '../logger'

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
        maxReportedDate: Date,
        maxReportedDateString: String
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
        maxReportedDate: Date,
        maxReportedDateString: String
    },
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
}, {
    usePushEach: true
})

releaseSchema.statics.getUserHighestRoleInThisRelease = async (releaseID, user) => {
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID), {
        manager: 1,
        leader: 1,
        team: 1,
        nonProjectTeam: 1
    })
    if (release) {
        /**
         * Check to see user's highest role in this release as user can have multiple role in release like he can be leader as well as developer
         */
        if (release.manager && release.manager._id == user._id) {
            return SC.ROLE_MANAGER
        }
        else if (release.leader && release.leader._id == user._id) {
            return SC.ROLE_LEADER
        }
        else if (release.team && release.team.length && release.team.findIndex(t => t._id == user._id) != -1) {
            return SC.ROLE_DEVELOPER
        }
        else if (release.nonProjectTeam && release.nonProjectTeam.length && release.nonProjectTeam.findIndex(t => t._id == user._id) != -1) {
            return SC.ROLE_NON_PROJECT_DEVELOPER
        }
        else {
            let User = await MDL.UserModel.findById(mongoose.Types.ObjectId(user._id))
            if (User && User.roles && User.roles.length && User.roles.findIndex(role => role.name == SC.ROLE_DEVELOPER) != -1) {
                return SC.ROLE_NON_PROJECT_DEVELOPER
            } else return undefined
        }
    }
    return undefined
}


releaseSchema.statics.getUserRolesInThisRelease = async (releaseID, user) => {
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID), {
        manager: 1,
        leader: 1,
        team: 1,
        nonProjectTeam: 1
    })

    logger.debug("getUserRolesInThisRelease(): ", {release})

    let rolesInRelease = []

    if (release) {
        if (release.manager && release.manager._id == user._id)
            rolesInRelease.push(SC.ROLE_MANAGER)

        if (release.leader && release.leader._id == user._id)
            rolesInRelease.push(SC.ROLE_LEADER)

        if (release.team && release.team.length && release.team.findIndex(t => t._id == user._id) != -1)
            rolesInRelease.push(SC.ROLE_DEVELOPER)

        if (release.nonProjectTeam && release.nonProjectTeam.length && release.nonProjectTeam.findIndex(t => t._id == user._id) != -1)
            rolesInRelease.push(SC.ROLE_NON_PROJECT_DEVELOPER)
    }

    if(rolesInRelease.length == 0)
        return undefined;

    return rolesInRelease
}


releaseSchema.statics.addRelease = async (projectAwardData, user, estimation) => {
    let releaseInput = {}
    let initial = {}
    const project = await MDL.ProjectModel.findById(mongoose.Types.ObjectId(projectAwardData.estimation.project._id))
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const manager = await MDL.UserModel.findOne({
        '_id': mongoose.Types.ObjectId(projectAwardData.manager._id),
        'roles.name': SC.ROLE_MANAGER
    })
    if (!manager)
        throw new AppError('Project Manager not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const leader = await MDL.UserModel.findById({
        '_id': mongoose.Types.ObjectId(projectAwardData.leader._id),
        'roles.name': SC.ROLE_LEADER
    })
    if (!leader)
        throw new AppError('Project Leader not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const projectAlreadyAwarded = await ReleaseModel.findOne({'project._id': mongoose.Types.ObjectId(projectAwardData.estimation.project._id)})
    if (projectAlreadyAwarded)
        throw new AppError('Project already awarded', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    initial.estimatedHours = estimation.estimatedHours
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
    if (status && status.toLowerCase() != 'all')
        filter = {
            $or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}],
            'status': status
        }
    else
        filter = {$or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}]}

    return await ReleaseModel.find(filter)
}

releaseSchema.statics.getReleaseById = async (releaseId, role, user) => {
    let release = await ReleaseModel.findOne({
        '_id': mongoose.Types.ObjectId(releaseId),
        $or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}]
    })
    release = release.toObject()
    release.highestRoleInThisRelease = role
    return release
}


releaseSchema.statics.getReleaseDetailsForReporting = async (releaseId, user) => {
    return await ReleaseModel.find({
        $and: [{
            _id: mongoose.Types.ObjectId(releaseId),
            $or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}, {'team._id': mongoose.Types.ObjectId(user._id)}, {'nonProjectTeam._id': mongoose.Types.ObjectId(user._id)}]
        }]
    }, {
        name: 1,
        project: 1,
        'initial.devStartDate': 1,
        'initial.devEndDate': 1
    })
}


//Reporting
releaseSchema.statics.getAllReleasesOfUser = async (user) => {
    return await MDL.ReleaseModel.find(
        {$or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}, {'team._id': mongoose.Types.ObjectId(user._id)}, {'nonProjectTeam._id': mongoose.Types.ObjectId(user._id)}]}, {
            project: 1,
            name: 1,
            _id: 1
        })
}

releaseSchema.statics.getTaskPlanedForEmployee = async (ParamsInput, user) => {
    //ParamsInput.releaseID
    //ParamsInput.planDate
    //ParamsInput.taskStatus
    let momentTzPlanningDateString = momentTZ.tz(ParamsInput.planDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(ParamsInput.releaseID))
    if (!release)
        throw new AppError('Release not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    release = release.toObject()
    let taskPlans = await MDL.TaskPlanningModel.find({
        'release._id': mongoose.Types.ObjectId(release._id),
        'planningDate': momentTzPlanningDateString,
        'employee._id': mongoose.Types.ObjectId(user._id)
    })
    release.taskPlans = taskPlans
    return release
}

releaseSchema.statics.getTaskAndProjectDetails = async (taskPlanID, releaseID, user) => {
    // check release is valid or not
    if (!releaseID) {
        throw new AppError('Release id not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    if (!taskPlanID) {
        throw new AppError('task plan id not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }

    let release = await MDL.ReleaseModel.findById(releaseID)
    if (!release)
        throw new AppError('Not a valid release', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)

    //user Role in this release to see task detail
    const userRoleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(release._id, user)
    if (!userRoleInRelease)
        throw new AppError('Not a user of this release', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    //check task plan is valid or not

    let taskPlan = await MDL.TaskPlanningModel.findById(taskPlanID)

    if (!taskPlan)
        throw new AppError('Not a valid taskPlan', EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)


    let releasePlan = await MDL.ReleasePlanModel.findById(mongoose.Types.ObjectId(taskPlan.releasePlan._id), {
        task: 1,
        description: 1,
        estimation: 1,
        comments: 1,
    })


    let estimationDescription = {description: ''}

    if (releasePlan && releasePlan.estimation && releasePlan.estimation._id) {
        estimationDescription = await MDL.EstimationModel.findOne({
            '_id': mongoose.Types.ObjectId(releasePlan.estimation._id),
            status: SC.STATUS_PROJECT_AWARDED
        }, {
            description: 1,
            _id: 0
        })
    }

    release = release.toObject()
    release.estimationDescription = estimationDescription.description
    release.releasePlan = releasePlan
    release.taskPlan = taskPlan
    return release
}

const ReleaseModel = mongoose.model('Release', releaseSchema)
export default ReleaseModel
