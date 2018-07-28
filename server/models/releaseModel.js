import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import * as V from '../validation'
import momentTZ from 'moment-timezone'
import * as U from '../utils'
import logger from '../logger'
import EstimationModel from "./estimationModel";

mongoose.Promise = global.Promise

let releaseSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Release Version name is required']},
    devStartDate: Date, // Expected development start date
    devEndDate: Date, // Expected development end date
    clientReleaseDate: Date, // Client release date
    status: {
        type: String,
        enum: [SC.STATUS_AWARDED, SC.STATUS_DEV_IN_PROGRESS, SC.STATUS_DEV_COMPLETED, SC.STATUS_ISSUE_FIXING, SC.STATUS_TEST_COMPLETED, SC.STATUS_RELEASED, SC.STATUS_STABLE]
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
    iterations: [{
        type: {type: String},
        expectedBilledHours: {type: Number, default: 0}, // expected billed hours
        billingRate: {type: Number, default: 0}, // Billing rate per hours
        estimatedHours: {type: Number, default: 0}, // sum of estimated hours of all release plan
        plannedHours: {type: Number, default: 0}, // sum of planned hours of all task plans across this release
        reportedHours: {type: Number, default: 0},// sum of reported hours of all task plans across this release
        // sum of planned hours of all release plans but maximum planned hours added per release plan would be estimated hours
        // Helps in finding out percentage of planned work
        plannedHoursEstimatedTasks: {type: Number, default: 0},
        // sum of estimated hours of release plans that are completed
        estimatedHoursCompletedTasks: {type: Number, default: 0},
        // Sum of planned hours of all the reported task plans
        // Helps in calculating progress
        plannedHoursReportedTasks: {type: Number, default: 0},
        progress: {type: Number, default: 0.0}, // overall progress of this release in percentage
        devStartDate: Date, // Expected development start date
        devEndDate: Date, // Expected development end date
        clientReleaseDate: Date, // Client release date
        actualReleaseDate: Date, // Actual release date
        maxReportedDate: Date, // Maximum reported date
        maxReportedDateString: String, // Maximum reported date string
        negotiator: {
            _id: mongoose.Schema.ObjectId,
            firstName: String,
            lastName: String
        },
        estimation: {
            _id: {type: mongoose.Schema.ObjectId}
        },
        stats: [{
            type: {type: String, enum: [SC.TYPE_REVIEW, SC.TYPE_TESTING, SC.TYPE_MANAGEMENT, SC.TYPE_DEVELOPMENT]},
            estimatedHours: {type: Number, default: 0},
            plannedHours: {type: Number, default: 0},
            reportedHours: {type: Number, default: 0}
        }]
    }],
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()}
}, {
    usePushEach: true
})


releaseSchema.statics.getAvailableReleases = async (status, user) => {
    return await ReleaseModel.find({})
}

releaseSchema.statics.getReleases = async (status, user) => {

    let filter = {}
    if (status && status.toLowerCase() !== SC.ALL)
        filter = {
            $or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}],
            'status': status
        }
    else
        filter = {$or: [{'manager._id': mongoose.Types.ObjectId(user._id)}, {'leader._id': mongoose.Types.ObjectId(user._id)}]}

    return await ReleaseModel.find(filter)
}


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
        if (release.manager && release.manager._id.toString() === user._id.toString()) {
            return SC.ROLE_MANAGER
        }
        else if (release.leader && release.leader._id.toString() === user._id.toString()) {
            return SC.ROLE_LEADER
        }
        else if (release.team && release.team.length && release.team.findIndex(t => t._id.toString() === user._id.toString()) != -1) {
            return SC.ROLE_DEVELOPER
        }
        else if (release.nonProjectTeam && release.nonProjectTeam.length && release.nonProjectTeam.findIndex(t => t._id.toString() === user._id.toString()) != -1) {
            return SC.ROLE_NON_PROJECT_DEVELOPER
        }
        else {
            let User = await MDL.UserModel.findById(mongoose.Types.ObjectId(user._id))
            if (User && User.roles && User.roles.length && User.roles.findIndex(role => role.name === SC.ROLE_DEVELOPER) != -1) {
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

    let rolesInRelease = []

    if (release) {
        if (release.manager && release.manager._id.toString() === user._id.toString())
            rolesInRelease.push(SC.ROLE_MANAGER)

        if (release.leader && release.leader._id.toString() === user._id.toString())
            rolesInRelease.push(SC.ROLE_LEADER)

        if (release.team && release.team.length && release.team.findIndex(t => t._id.toString() === user._id.toString()) != -1)
            rolesInRelease.push(SC.ROLE_DEVELOPER)

        if (release.nonProjectTeam && release.nonProjectTeam.length && release.nonProjectTeam.findIndex(t => t._id.toString() === user._id.toString()) != -1)
            rolesInRelease.push(SC.ROLE_NON_PROJECT_DEVELOPER)
    }

    if (rolesInRelease.length == 0)
        return undefined

    return rolesInRelease
}

/**
 * Create a release from estimation and release data provided while creating release
 * @param releaseData - data like billing hours, release state date, manager, leader, team details etc
 * @param user - Negotiator user
 * @param estimation - Estimation for which release is being created
 * @returns {Promise<void>}
 */

releaseSchema.statics.createRelease = async (releaseData, user, estimation) => {
    let releaseInput = {}
    const project = await MDL.ProjectModel.findById(mongoose.Types.ObjectId(releaseData.estimation.project._id))
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const manager = await MDL.UserModel.findOne({
        '_id': mongoose.Types.ObjectId(releaseData.manager._id),
        'roles.name': SC.ROLE_MANAGER
    })

    if (!manager)
        throw new AppError('Project Manager not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const leader = await MDL.UserModel.findById({
        '_id': mongoose.Types.ObjectId(releaseData.leader._id),
        'roles.name': SC.ROLE_LEADER
    })
    if (!leader)
        throw new AppError('Project Leader not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    if (leader._id.toString() === manager._id.toString()) {
        throw new AppError('Manager and leader can not be the  same user please choose different one ', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    if (estimation.release && estimation.release._id) {
        throw new AppError('Release already created for this estimation', EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }

    releaseInput.project = project
    releaseInput.manager = manager
    releaseInput.leader = leader
    releaseInput.team = releaseData.team
    releaseInput.estimations = estimation
    releaseInput.clientReleaseDate = U.dateInUTC(releaseData.clientReleaseDate)
    releaseInput.devStartDate = U.dateInUTC(releaseData.devStartDate)
    releaseInput.devEndDate = U.dateInUTC(releaseData.devReleaseDate)

    /*
       We would add three iterations below
       an 'estimated' iteration - For all tasks that are part of estimations
       a 'planned' iteration - For tasks that would be added from release interface
       an 'unplanned' iteration - For unplanned work that would be reported from reporting interface

     */
    releaseInput.iterations = [{
        type: SC.ITERATION_TYPE_ESTIMATED,
        estimatedHours: estimation.estimatedHours,
        expectedBilledHours: releaseData.billedHours,
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate),
        negotiator: user,
        stats: estimation.stats.map(s => {
            return {
                type: s.type,
                estimatedHours: s.estimatedHours
            }
        })
    }, {
        type: SC.ITERATION_TYPE_PLANNED,
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate)
    }, {
        type: SC.ITERATION_TYPE_UNPLANNED
    }]

    releaseInput.name = releaseData.releaseVersionName
    releaseInput.status = SC.STATUS_AWARDED
    releaseInput.negotiator = user
    return await ReleaseModel.create(releaseInput)
}

releaseSchema.statics.updateRelease = async (releaseData, user, estimation) => {
    const release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseData.release._id))
    if (!release)
        throw new AppError('Release not found', EC.DATA_INCONSISTENT, EC.HTTP_SERVER_ERROR)

    if (release.project._id.toString() != estimation.project._id.toString())
        throw new AppError('Project of Estimation and Release are different!', EC.DIFFERENT_PROJECT, EC.HTTP_BAD_REQUEST)

    /*
      Since estimation is added to release, a new iteration would be created with type as 'estimated' for this estimation
     */

    let clientReleaseDate = U.momentInUTC(releaseData.clientReleaseDate)
    let devStartDate = U.momentInUTC(releaseData.devStartDate)
    let devEndDate = U.momentInUTC(releaseData.devReleaseDate)


    release.iterations.push({
        type: SC.ITERATION_TYPE_ESTIMATED,
        estimatedHours: estimation.estimatedHours,
        expectedBilledHours: releaseData.billedHours,
        clientReleaseDate: clientReleaseDate.toDate(),
        devStartDate: devStartDate.toDate(),
        devEndDate: devEndDate.toDate(),
        negotiator: user,
        stats: estimation.stats.map(s => {
            return {
                type: s.type,
                estimatedHours: s.estimatedHours
            }
        })
    })

    // Change release' dev start/end and client release date
    if (clientReleaseDate.isAfter(release.clientReleaseDate)) {
        release.clientReleaseDate = clientReleaseDate
        release.iterations[1].clientReleaseDate = clientReleaseDate
    }

    if (devEndDate.isAfter(release.devEndDate)) {
        release.devEndDate = devEndDate
        release.iterations[1].devEndDate = devEndDate
    }

    if (devStartDate.isBefore(release.devStartDate)) {
        release.devStartDate = devStartDate
        release.iterations[1].devStartDate = devStartDate
    }

    return await release.save()
}

releaseSchema.statics.updateReleaseDates = async (releaseInput, user, schemaRequested) => {
    console.log("releaseInput", releaseInput)
    if (schemaRequested)
        return V.generateSchema(V.releaseUpdateDatesStruct)

    V.validate(releaseInput, V.releaseUpdateDatesStruct)

    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseInput._id))

    release.devStartDate = U.dateInUTC(releaseInput.devStartDate)
    release.devEndDate = U.dateInUTC(releaseInput.devReleaseDate)
    release.clientReleaseDate = U.dateInUTC(releaseInput.clientReleaseDate)

    // update dates in 'planned' task iteration as well
    release.iterations[1].devStartDate = U.dateInUTC(releaseInput.devStartDate)
    release.iterations[1].devEndDate = U.dateInUTC(releaseInput.devReleaseDate)
    release.iterations[1].clientReleaseDate = U.dateInUTC(releaseInput.clientReleaseDate)
    return await release.save()
}

releaseSchema.statics.getReleaseById = async (releaseId, user) => {
    let release = undefined

    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInThisRelease(releaseId, user)

    if (U.includeAny(SC.ROLE_MANAGER, rolesInRelease)) {
        release = await ReleaseModel.findOne({
                '_id': mongoose.Types.ObjectId(releaseId),
                'manager._id': mongoose.Types.ObjectId(user._id)
            }
        )
    } else if (U.includeAny(SC.ROLE_LEADER, rolesInRelease)) {
        release = await ReleaseModel.findOne({
                '_id': mongoose.Types.ObjectId(releaseId),
                'leader._id': mongoose.Types.ObjectId(user._id)
            }
        )
    } else if (U.includeAny([SC.ROLE_DEVELOPER, SC.ROLE_NON_PROJECT_DEVELOPER], rolesInRelease)) {
        release = await ReleaseModel.findOne({
                '_id': mongoose.Types.ObjectId(releaseId),
                "$or": [
                    {'team._id': mongoose.Types.ObjectId(user._id)},
                    {'nonProjectTeam._id': mongoose.Types.ObjectId(user._id)}
                ]
            }
        )
    }

    if (release) {
        release = release.toObject()
        release.rolesInThisRelease = rolesInRelease
        return release
    }

    return undefined

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

/**
 * This method would return all releases that an estimation could be added against by negotiator
 * @param estimationId - Estimation that needs to be added
 * @param user - Logged in user who is requesting fo estimation
 * @returns {Releases}
 */
releaseSchema.statics.getAllReleasesToAddEstimation = async (estimationId, negotiator) => {
    let estimation = await EstimationModel.findById(estimationId, {
        "project._id": 1,
        "negotiator": 1
    })

    if (!estimation)
        throw new AppError('Estimation not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.negotiator._id.toString() !== negotiator._id.toString())
        throw new AppError('Not a negotiator of this estimation', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    return await ReleaseModel.aggregate([{
        $match: {
            $and: [{
                "project._id": mongoose.Types.ObjectId(estimation.project._id)
            }]
        }
    }, {
        $project: {
            name: {$concat: ["$project.name", " (", "$name", ")"]}
        }
    }])
}


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
    let momentTzPlanningDateString = momentTZ.tz(ParamsInput.planDate, SC.DATE_FORMAT, SC.UTC_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)

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
