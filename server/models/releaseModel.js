import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import * as MDL from '../models'
import * as V from '../validation'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import * as U from '../utils'
import EstimationModel from "./estimationModel";
import logger from '../logger'

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
    developmentType: {
        _id: mongoose.Schema.ObjectId,
        name: String
    },
    project: {
        _id: {type: mongoose.Schema.ObjectId, required: true},
        name: {type: String, required: [true, 'Project name is required']}
    },
    module: {
        _id: {type: mongoose.Schema.ObjectId},
        name: {type: String}
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
    technologies: [{
        _id: mongoose.Schema.ObjectId,
        name: String
    }],
    iterations: [{
        type: {
            type: String,
            enum: [SC.ITERATION_TYPE_ESTIMATED, SC.ITERATION_TYPE_PLANNED, SC.ITERATION_TYPE_UNPLANNED]
        },
        name: {type: String},
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

releaseSchema.statics.getMyReleases = async (status, user) => {
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

releaseSchema.statics.getAllReleases = async (status, user) => {
    let filter = {}
    if (!U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
        throw new AppError("Only user with role [" + SC.ROLE_TOP_MANAGEMENT + "] can see all releases")
    }

    if (status && status.toLowerCase() !== SC.ALL) {
        filter = {
            'status': status
        }
    }
    else {
        filter = {}
    }

    return await ReleaseModel.find(filter)
}

releaseSchema.statics.search = async (criteria, user) => {

    if (!U.userHasRole(user, SC.ROLE_MANAGER) && !U.userHasRole(user, SC.ROLE_LEADER) && !U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT))
        throw new AppError('Only user with role [' + SC.ROLE_MANAGER + ' or ' + SC.ROLE_LEADER + '] can search releases', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    if (criteria) {
        let filter = {}

        if (!U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
            // user would only be able to see releases where he is manager or leader
            filter['$or'] = [
                {'manager._id': user._id},
                {'leader._id': user._id}
            ]

            if (criteria.leader && user._id.toString() != criteria.leader) {
                if (criteria.leader) {
                    filter['leader._id'] = criteria.leader
                }
            }

            if (criteria.manager && user._id.toString() != criteria.manager) {
                filter['manager._id'] = criteria.manager
            }

        } else {
            if (criteria.leader) {
                filter['leader._id'] = criteria.leader
            }

            if (criteria.manager) {
                filter['manager._id'] = criteria.manager
            }
        }

        if (criteria.showActive) {
            // only active releases needs to be shown, release that have are in progress on current date (based on their start/end date)
            let todaysMoment = U.momentInUTC(momentTZ.tz(SC.INDIAN_TIMEZONE).format(SC.DATE_FORMAT))
            filter['$and'] = [{'devStartDate': {$lte: todaysMoment.toDate()}}, {'devEndDate': {$gte: todaysMoment.toDate()}}]
        }

        if (criteria.status) {
            filter['status'] = criteria.status
        }


        logger.debug("searchRelease() ", {filter})
        return await ReleaseModel.find(filter)
    }

    return []
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


releaseSchema.statics.getUserRolesInRelease = async (release, user) => {
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

releaseSchema.statics.getUserRolesInReleaseById = async (releaseID, user) => {
    let release = await MDL.ReleaseModel.findById(mongoose.Types.ObjectId(releaseID), {
        manager: 1,
        leader: 1,
        team: 1,
        nonProjectTeam: 1
    })

    return await ReleaseModel.getUserRolesInRelease(release, user)


}

/**
 * Create release without estimation
 * @param releaseData
 * @param user
 * @returns {Promise<*>}
 */

releaseSchema.statics.createRelease = async (releaseData, user) => {
    if (!releaseData.releaseType)
        throw new AppError('Release Type is required to create release.', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (releaseData.releaseType == SC.RELEASE_TYPE_INTERNAL || releaseData.releaseType == SC.RELEASE_TYPE_CLIENT)
        V.validate(releaseData, V.releaseCreateStructNonTraining)
    else
        V.validate(releaseData, V.releaseCreateStructTraining)

    let release = new MDL.ReleaseModel()
    logger.debug("createRelease(): ", {releaseData})

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

    if (!releaseData.team || releaseData.team.length == 0) {
        throw new AppError('At least one developer should be assigned to a release', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    let project;

    if (releaseData.releaseType == SC.RELEASE_TYPE_TRAINING) {

    } else {
        project = await MDL.ProjectModel.findById(mongoose.Types.ObjectId(releaseData.project._id), {name: 1})
    }

    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (releaseData.module && releaseData.module._id) {
        const module = await MDL.ModuleModel.findById(mongoose.Types.ObjectId(releaseData.module._id), {name: 1})
        if (!module)
            throw new AppError('Module not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        release.module = module
    }

    const developmentType = await MDL.DevelopmentModel.findById(mongoose.Types.ObjectId(releaseData.developmentType._id), {name: 1})
    if (!developmentType)
        throw new AppError('Development type not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    release.developmentType = developmentType
    release.project = project
    release.manager = manager
    release.leader = leader
    release.team = releaseData.team
    release.technologies = releaseData.technologies
    release.clientReleaseDate = U.dateInUTC(releaseData.clientReleaseDate)
    release.devStartDate = U.dateInUTC(releaseData.devStartDate)
    release.devEndDate = U.dateInUTC(releaseData.devReleaseDate)

    /*
       We would add two iterations below
       a 'planned' iteration - For tasks that would be added from release interface
       an 'unplanned' iteration - For unplanned work that would be reported from reporting interface

     */
    release.iterations = [{
        type: SC.ITERATION_TYPE_PLANNED,
        name: "Planned",
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate)
    }, {
        type: SC.ITERATION_TYPE_UNPLANNED,
        name: "Unplanned",
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate)
    }]

    release.name = releaseData.releaseVersionName
    release.status = SC.STATUS_AWARDED
    release.negotiator = user
    return await release.save()
}

const updateReleaseValidateTeam = async (releaseID, team, newTeam) => {

    let existingTeamIDs = team.map(t => t._id.toString())
    let newTeamIDs = newTeam.map(t => t._id.toString())

    for (const eti of existingTeamIDs) {
        if (!U.includeAny(eti, newTeamIDs)) {
            logger.debug("updateRelease(): team member [" + eti + '] is removed from release')
            // Team member with task plan associated cannot be removed from release
            let taskCount = await MDL.TaskPlanningModel.count({
                'release._id': releaseID,
                'employee._id': mongoose.Types.ObjectId(eti)
            })
            if (taskCount > 0) {
                let employee = team.find(t => t._id.toString() == eti)
                throw new AppError('You cannot remove [' + employee.name + '] from release as user has planned tasks in this release')
            }
        }
    }
}

releaseSchema.statics.updateRelease = async (releaseData, user) => {

    //V.validate(releaseData, V.releaseUpdateStruct)

    // try to see if release exists

    let release = await ReleaseModel.findById(releaseData._id)

    if (!release)
        throw new AppError("Release not found ", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInRelease(release, user)

    if (!U.includeAny(SC.ROLE_MANAGER, rolesInRelease)) {
        throw new AppError('Only Manager of release can update a release', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    logger.debug("updateRelease(): ", {releaseData})

    const manager = await MDL.UserModel.findOne({
        '_id': mongoose.Types.ObjectId(releaseData.manager._id),
        'roles.name': SC.ROLE_MANAGER
    })

    if (!manager)
        throw new AppError("Either this user do not exists or do not have manager role", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    const leader = await MDL.UserModel.findById({
        '_id': mongoose.Types.ObjectId(releaseData.leader._id),
        'roles.name': SC.ROLE_LEADER
    })

    if (!leader)
        throw new AppError('Either user do not exists or do not have manager role', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (leader._id.toString() === manager._id.toString()) {
        throw new AppError('Manager and leader can not be the same user please choose different users for each role.', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    if (!releaseData.team || releaseData.team.length == 0) {
        throw new AppError('At least one developer should be assigned to a release', EC.INVALID_OPERATION, EC.HTTP_BAD_REQUEST)
    }

    const developmentType = await MDL.DevelopmentModel.findById(mongoose.Types.ObjectId(releaseData.developmentType._id), {name: 1})
    if (!developmentType)
        throw new AppError('Development type not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (release.manager._id.toString() != manager._id.toString() || release.leader._id.toString() != leader._id.toString()) {
        // Manager or Leader can only be changed if no planning has been done till now
        let taskCount = await MDL.TaskPlanningModel.count({
            'release._id': release._id
        })

        if (taskCount > 0)
            throw new AppError('Manger/Leader of release can only be changed when no plan is added into release', EC.INVALID_OPERATION, EC.HTTP_FORBIDDEN)
    }

    /*  Now we will compare previous team with new team and see if any existing developer is removed or not. Removing developer once they have
        assigned a task would be prevented
     */


    // iterate on existing team IDs to see if any id is not present in new team ids
    await updateReleaseValidateTeam(release._id, release.team, releaseData.team)

    // Now that team is validated we need to check if any user id is present in non-project team, if yes the we need to remove it from there


    if (release.nonProjectTeam && release.nonProjectTeam.length) {
        let nonProjectIDs = release.nonProjectTeam.map(t => t._id.toString())
        let newTeamIDs = releaseData.team.map(t => t._id.toString())

        nonProjectIDs.forEach(nonProjectID => {
            if (U.includeAny(nonProjectID, newTeamIDs))
                release.nonProjectTeam.pull({_id: nonProjectID})
        })
    }

    release.developmentType = developmentType
    release.manager = manager
    release.leader = leader
    release.team = releaseData.team
    return await release.save()
}


/**
 * Create a release from estimation and release data provided while creating release
 * @param releaseData - data like billing hours, release state date, manager, leader, team details etc
 * @param user - Negotiator user
 * @param estimation - Estimation for which release is being created
 * @returns {Promise<void>}
 */

releaseSchema.statics.createReleaseFromEstimation = async (releaseData, user, estimation) => {

    let release = new MDL.ReleaseModel()

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

    const project = await MDL.ProjectModel.findById(mongoose.Types.ObjectId(estimation.project._id), {name: 1})
    if (!project)
        throw new AppError('Project not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    if (estimation.module && estimation.module._id) {
        const module = await MDL.ModuleModel.findById(mongoose.Types.ObjectId(estimation.module._id), {name: 1})
        if (!module)
            throw new AppError('Module not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
        release.module = module
    }

    release.project = project
    release.manager = manager
    release.leader = leader
    release.developmentType = estimation.developmentType
    release.team = releaseData.team
    release.estimations = estimation
    release.clientReleaseDate = U.dateInUTC(releaseData.clientReleaseDate)
    release.devStartDate = U.dateInUTC(releaseData.devStartDate)
    release.devEndDate = U.dateInUTC(releaseData.devReleaseDate)
    release.technologies = estimation.technologies

    /*
       We would add three iterations below
       an 'estimated' iteration - For all tasks that are part of estimations
       a 'planned' iteration - For tasks that would be added from release interface
       an 'unplanned' iteration - For unplanned work that would be reported from reporting interface

     */
    release.iterations = [{
        type: SC.ITERATION_TYPE_ESTIMATED,
        name: releaseData.releaseVersionName,
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
        name: "Planned",
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate)
    }, {
        type: SC.ITERATION_TYPE_UNPLANNED,
        name: "Unplanned",
        clientReleaseDate: U.dateInUTC(releaseData.clientReleaseDate),
        devStartDate: U.dateInUTC(releaseData.devStartDate),
        devEndDate: U.dateInUTC(releaseData.devReleaseDate)
    }]

    release.name = releaseData.releaseVersionName
    release.status = SC.STATUS_AWARDED
    release.negotiator = user
    return await release.save()
}

/**
 * Creates a new iteration for this estimation and adds all the task plan to this release
 * @param releaseData
 * @param user
 * @param estimation
 */
releaseSchema.statics.addEstimationToRelease = async (releaseData, user, estimation) => {
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
        name: releaseData.name,
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

    let iterationIdx = release.iterations.findIndex(i => i._id.toString() == releaseInput.iteration._id.toString())
    logger.debug("updateReleaseDates(): iteration index " + iterationIdx)

    let devStartDate = U.momentInUTC(releaseInput.updatedDevStartDate)
    let devEndDate = U.momentInUTC(releaseInput.updatedDevEndDate)
    let clientReleaseDate = U.momentInUTC(releaseInput.updatedClientReleaseDate)

    if (iterationIdx >= 0) {
        // update dates in selected task iteration as well

        release.iterations[iterationIdx].devStartDate = devStartDate.toDate()
        release.iterations[iterationIdx].devEndDate = devEndDate.toDate()
        release.iterations[iterationIdx].clientReleaseDate = clientReleaseDate.toDate()

        // Iterate on all iterations to find max min
        let estimatedIterations = release.iterations
        let minDevStartMoment = null, maxDevEndMoment = null, maxClientReleaseMoment = null;

        estimatedIterations.forEach(i => {
            minDevStartMoment = minDevStartMoment ? minDevStartMoment.isAfter(i.devStartDate) ? moment(i.devStartDate) : minDevStartMoment : moment(i.devStartDate)
            maxDevEndMoment = maxDevEndMoment ? maxDevEndMoment.isBefore(i.devEndDate) ? moment(i.devEndDate) : maxDevEndMoment : moment(i.devEndDate)
            maxClientReleaseMoment = maxClientReleaseMoment ? maxClientReleaseMoment.isBefore(i.clientReleaseDate) ? moment(i.clientReleaseDate) : maxClientReleaseMoment : moment(i.clientReleaseDate)
        })

        release.clientReleaseDate = maxClientReleaseMoment.toDate()
        release.devEndDate = maxDevEndMoment.toDate()
        release.devStartDate = minDevStartMoment.toDate()
        return await release.save()
    }
    return {}
}

releaseSchema.statics.getFullReleaseDetailsById = async (releaseId, user) => {
    let release = undefined

    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(releaseId, user)

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
    } else if (U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
        // Top management can see all the details
        release = await ReleaseModel.findById(releaseId)
    }

    if (release) {
        release = release.toObject()
        release.rolesInThisRelease = rolesInRelease
        return release
    }

    throw new AppError("You are not authorized to veiw details of this release")

}

releaseSchema.statics.getReleaseDataForDashboard = async (queryData, user) => {
    let rolesInRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(queryData.releaseID, user)
    if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER], rolesInRelease) && !U.userHasRole(user, SC.ROLE_TOP_MANAGEMENT)) {
        throw new AppError('Not a Manager/Leader of this release.', EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    let release = await ReleaseModel.getFullReleaseDetailsById(queryData.releaseID, user)
    // Get data of past/present planning
    let employeeReleases = await MDL.EmployeeReleasesModel.find({
        "release._id": mongoose.Types.ObjectId(queryData.releaseID)
    }).lean()

    logger.debug("getReleaseDataForDashboard(): ", {employeeReleases})

    let result = {
        release
    }

    if (employeeReleases && employeeReleases.length) {
        let avg = employeeReleases.reduce((avg, er) => {
            logger.debug("getReleaseDataForDashboard(): Iterating on ", {er})
            if (er.management.before && er.management.before.plannedCount > 0) {
                avg.plannedBeforeAvg += U.twoDecimalHours(er.management.before.diffHours / er.management.before.plannedCount)
            }
            if (er.management.after && er.management.after.plannedCount > 0) {
                avg.plannedAfterAvg += U.twoDecimalHours(er.management.after.diffHours / er.management.after.plannedCount)
            }

            avg.plannedBeforeCount += er.management.before.plannedCount
            avg.plannedAfterCount += er.management.after.plannedCount

            if (er.report && er.report.reportedAfterCount > 0) {
                avg.reportedAfterAvg += U.twoDecimalHours(er.report.reportedAfterHours / er.report.reportedAfterCount)
            }

            avg.plannedHoursOnLeave += U.twoDecimalHours(er.leaves.plannedHoursOnLeave)
            avg.plannedHoursLastMinuteLeave += U.twoDecimalHours(er.leaves.plannedHoursLastMinuteLeave)
            return avg

        }, {
            plannedBeforeAvg: 0,
            plannedAfterAvg: 0,
            reportedAfterAvg: 0,
            plannedHoursOnLeave: 0,
            plannedHoursLastMinuteLeave: 0,
            plannedBeforeCount: 0,
            plannedAfterCount: 0
        })

        result.mgmtData = avg

    } else {
        result.mgmtData = {
            plannedBeforeAvg: 0,
            plannedAfterAvg: 0,
            reportedAfterAvg: 0,
            plannedHoursOnLeave: 0,
            plannedHoursLastMinuteLeave: 0,
            plannedBeforeCount: 0,
            plannedAfterCount: 0
        }
    }

    return result
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


releaseSchema.statics.getReportingReleasesOfUser = async (user) => {
    return await MDL.ReleaseModel.find(
        {$or: [{'team._id': mongoose.Types.ObjectId(user._id)}, {'nonProjectTeam._id': mongoose.Types.ObjectId(user._id)}]}, {
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

releaseSchema.statics.getReleasesByIDs = async (releaseIDs, select) => {
    let releases = []

    for (const releaseID of releaseIDs) {
        let release

        if (select)
            release = await ReleaseModel.findById(releaseID, select)
        else
            release = await ReleaseModel.findById(releaseID)

        releases.push(release)
    }
    return releases
}

releaseSchema.statics.getReleaseEmployees = async (releaseID) => {
    let release = await ReleaseModel.findById(releaseID, {
        team: 1,
        nonProjectTeam: 1
    })

    if (!release)
        return []

    return [...release.team, ...release.nonProjectTeam]
}


const fixReleaseStatsIterateReleasePlans = async (releasePlans, release) => {
    let sumPlannedHoursEstimatedTasks = 0

    for (const rp of releasePlans) {
        // get sum of all planned hours for this release plan
        let taskPlansSummary = await MDL.TaskPlanningModel.aggregate({
                $match: {
                    "releasePlan._id": rp._id
                }
            },
            {
                $group: {
                    _id: null,
                    plannedHours: {$sum: "$planning.plannedHours"},
                    reportedHours: {$sum: "$report.reportedHours"}
                }
            })

        let plannedHours = 0


        if (taskPlansSummary && taskPlansSummary.length && rp.task.estimatedHours > taskPlansSummary[0].plannedHours)
            plannedHours = taskPlansSummary[0].plannedHours
        else if (taskPlansSummary && taskPlansSummary.length)
            plannedHours = rp.task.estimatedHours

        logger.debug("rp entry ==> ", {
            plannedHours,
            estimatedHours: rp.task.estimatedHours,
            taskPlanSummary: taskPlansSummary && taskPlansSummary.length ? taskPlansSummary[0].plannedHours : -1
        })

        sumPlannedHoursEstimatedTasks += plannedHours
    }

    return {
        sumPlannedHoursEstimatedTasks
    }


}

releaseSchema.statics.fixReleaseStats = async (releaseID) => {
    let release = await ReleaseModel.findById(releaseID)
    // Find all task plans of this release

    logger.debug("************* RELEASE STATS ANALYSIS ***********")

    let taskPlansSummary = await MDL.TaskPlanningModel.aggregate({
            $match: {
                "release._id": release._id
            }
        },
        {
            $group: {
                _id: null,
                plannedHours: {$sum: "$planning.plannedHours"},
                reportedHours: {$sum: "$report.reportedHours"}
            }
        })

    let plannedHours = taskPlansSummary[0].plannedHours
    let reportedHours = taskPlansSummary[0].reportedHours

    let sumEstimatedHoursCompleted = await MDL.ReleasePlanModel.aggregate({
            $match: {
                "report.finalStatus": SC.STATUS_COMPLETED,
                "release._id": release._id
            }
        },
        {
            $group: {
                _id: null,
                estimatedHours: {$sum: "$task.estimatedHours"}
            }
        })

    let estimatedHoursCompletedTasks = sumEstimatedHoursCompleted[0].estimatedHours

    let releasePlans = await MDL.ReleasePlanModel.find({"release._id": release._id})

    let releasePlanStats = await fixReleaseStatsIterateReleasePlans(releasePlans)

    // find out release plans

    logger.debug("fixReleaseStats(): ", {iterations: release.iterations})
    logger.debug("fixReleaseStats(): ", {
        plannedHours,
        reportedHours,
        estimatedHoursCompletedTasks,
        plannedHoursEstimatedTasks: releasePlanStats.sumPlannedHoursEstimatedTasks
    })

    return {success: true}
}


const ReleaseModel = mongoose.model('Release', releaseSchema)
export default ReleaseModel
