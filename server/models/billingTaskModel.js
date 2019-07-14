import mongoose from 'mongoose'
import * as MDL from '../models'
import { BILLING_STATUS_INREVIEW, BILLING_STATUS_APPROVED, BILLING_STATUS_CREATED, BILLING_STATUS_BILLED, BILLING_STATUS_PAID, REPORT_PENDING, REPORT_COMPLETED, DATE_AND_DAY_SHOW_FORMAT, DATE_DISPLAY_FORMAT, DATE_FORMAT, OWNER_TYPE_CLIENT } from '../serverconstants'
mongoose.Promise = global.Promise
import logger from '../logger'
import AppError from '../AppError';
import { NO_BILLING_RATE, ACCESS_DENIED, HTTP_FORBIDDEN } from '../errorcodes'
import { userHasRole, momentInUTC } from '../utils'
import { ROLE_TOP_MANAGEMENT } from '../serverconstants'

let billingTaskSchema = mongoose.Schema({
    billedDate: Date,
    billedHours: { type: Number, default: 0 },
    description: String, // Timesheet description
    billingRate: { type: Number, default: 0 }, // Billing rate this billing task would be charged
    billingAmount: { type: Number, default: 0 }, // billing rate * billed hours
    status: { type: String, enum: [BILLING_STATUS_INREVIEW, BILLING_STATUS_APPROVED, BILLING_STATUS_CREATED, BILLING_STATUS_BILLED, BILLING_STATUS_PAID], default: BILLING_STATUS_INREVIEW },
    // Developer against which this earning would go against
    billingEmployee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    // Employee shown in timesheet
    timesheetEmployee: {
        _id: mongoose.Schema.ObjectId,
        name: { type: String }
    },
    timeSheet: {
        _id: mongoose.Schema.ObjectId
    },
    taskPlan: {
        _id: mongoose.Schema.ObjectId,
        employee: {
            _id: mongoose.Schema.ObjectId,
            name: { type: String, required: [true, 'employee name is required'] }
        },
        planningDate: Date,
        report: {
            status: {
                type: String,
                enum: [REPORT_COMPLETED, REPORT_PENDING]
            },
            reportedHours: { type: Number, default: 0 },
            description: String
        }
    },
    releasePlan: {
        _id: mongoose.Schema.ObjectId,
        task: {
            name: String
        }
    },
    release: {
        _id: mongoose.Schema.ObjectId
    },
    project: {
        _id: mongoose.Schema.ObjectId
    },
    client: {
        _id: mongoose.Schema.ObjectId
    }
})

billingTaskSchema.statics.createBillingTaskFromReportedTask = async (taskPlan) => {
    let release = await MDL.ReleaseModel.findById(taskPlan.release._id)
    let releasePlan = await MDL.ReleasePlanModel.findById(taskPlan.releasePlan._id, { "task.name": 1, 'release': 1 })
    logger.debug("createBillingTaskFromReportedTask() ", { release, releasePlan })
    let client = await MDL.ClientModel.findById(release.client._id)

    let billingRate = await MDL.BillingRateModel.findOne({ "owner.type": OWNER_TYPE_CLIENT, "owner._id": client._id })
    if (!billingRate) {
        console.log("No billing rate found for client [" + client.name + "]")
        return;
    }

    let billingTask = new BillingTaskModel()
    billingTask.billedDate = taskPlan.planningDate
    billingTask.billedHours = taskPlan.report.reportedHours
    billingTask.billingAmount = taskPlan.report.reportedHours * billingRate.billingRate
    billingTask.billingRate = billingRate.billingRate
    billingTask.description = taskPlan.report.description
    billingTask.status = BILLING_STATUS_INREVIEW
    billingTask.billingEmployee = taskPlan.employee
    billingTask.timesheetEmployee = taskPlan.employee
    billingTask.taskPlan = taskPlan
    billingTask.release = release
    billingTask.releasePlan = releasePlan
    billingTask.client = release.client
    billingTask.project = release.project
    await billingTask.save()
    logger.debug("Billing task created as ", { billingTask })
    await MDL.MonthlySummaryCompanyModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryClientModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryEmployeeModel.billingTaskCreated(billingTask)
    await MDL.MonthlySummaryProjectModel.billingTaskCreated(billingTask)
    // increment unbilled hours in release plan/release

    let releaseUpdates = {}
    releaseUpdates['$inc'] = {}
    releaseUpdates['$inc']['iterations.' + releasePlan.release.iteration.idx + '.unbilledHours'] = billingTask.billedHours

    logger.debug("release updates formed as ", { releaseUpdates })

    await MDL.ReleaseModel.updateOne({
        '_id': billingTask.release._id
    }, releaseUpdates)

    await MDL.ReleasePlanModel.updateOne({
        '_id': billingTask.releasePlan._id
    }, {
            $inc: { 'billing.unbilledHours': billingTask.billedHours }
        })

    return billingTask
}

/*
This API would return all the clients that have billing tasks as per criteira and as per logged in user roles
*/
billingTaskSchema.statics.getBillingClients = async (criteria, user) => {
    if (userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        let distinctClientIDs = await BillingTaskModel.distinct("client._id", { "status": { $in: [BILLING_STATUS_INREVIEW, BILLING_STATUS_APPROVED] } })
        if (!distinctClientIDs || !distinctClientIDs.length)
            return []
        console.log("client ids found as ", distinctClientIDs)
        return await MDL.ClientModel.find({ "_id": { $in: distinctClientIDs } })

    } else {
        // user would only see those clients which has billing tasks of releases this user is either leader or manager
        let distinctReleaseIDs = await BillingTaskModel.distinct("release._id", { "status": { $in: [BILLING_STATUS_INREVIEW, BILLING_STATUS_APPROVED] } })
        console.log("distinct release IDs is ", distinctReleaseIDs)
        // Filter release ids that has this user as either manager or leader
        let userReleaseIDs = await MDL.ReleaseModel.distinct("_id", { "_id": { $in: distinctReleaseIDs }, $or: [{ "manager._id": user._id }, { "leader._id": user._id }, { "status": { $in: [BILLING_STATUS_INREVIEW, BILLING_STATUS_APPROVED] } }] })
        if (!userReleaseIDs || !userReleaseIDs.length)
            return []
        let distinctClientIDs = await MDL.ReleaseModel.distinct("client._id", { "_id": { $in: userReleaseIDs } })
        if (!distinctClientIDs || !distinctClientIDs.length)
            return []
        return await MDL.ClientModel.find({ "_id": { $in: distinctClientIDs } })
    }
}

billingTaskSchema.statics.getBillingProjects = async (criteria, user) => {
    console.log("getBillingReleases called")
    let fromMoment = undefined
    let toMoment = undefined
    if (criteria.fromDate) {
        fromMoment = momentInUTC(criteria.fromDate)
    }
    if (criteria.toDate) {
        toMoment = momentInUTC(criteria.toDate)
    }
    let crit = {
        'client._id': mongoose.Types.ObjectId(criteria.clientID)
    }
    if (userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        // User would see all those clients which has billing tasks as per criteria
        if (fromMoment && toMoment && fromMoment.isValid() && toMoment.isValid()) {
            crit['$and'] = [{ 'billedDate': { $gte: fromMoment.toDate() } }, { 'billedDate': { $lte: toMoment.toDate() } }]
        } else if (fromMoment && fromMoment.isValid()) {
            crit['billedDate'] = { $gte: fromMoment.toDate() }
        } else if (toMoment && toMoment.isValid()) {
            crit['billedDate'] = { $lte: toMoment.toDate() }
        }

        let distinctProjectIDs = await BillingTaskModel.distinct("project._id", crit)
        let distinctReleaseIDs = await BillingTaskModel.distinct("release._id", crit)
        if (!distinctProjectIDs || !distinctProjectIDs.length)
            return []
        let projects = await MDL.ProjectModel.find({ "_id": { $in: distinctProjectIDs } }, { name: 1 })
        let result = []
        if (projects && projects.length) {
            for (let project of projects) {
                let releases = await MDL.ReleaseModel.find({ "_id": { $in: distinctReleaseIDs }, "project._id": project._id }, { name: 1 })
                for (let release of releases) {
                    result.push({
                        releaseID: release._id,
                        projectID: project._id,
                        projectName: project.name,
                        releaseName: release.name
                    })
                }
            }
        }

        return result;

    } else {
        // user would only see those clients which has billing tasks of releases this user is either leader or manager
        let distinctProjectIDs = await BillingTaskModel.distinct("project._id", crit)
        let distinctReleaseIDs = await BillingTaskModel.distinct("release._id", crit)
        console.log("distinct release IDs is ", distinctReleaseIDs)
        // Filter release ids that has this user as either manager or leader
        let userProjectIDs = await MDL.ReleaseModel.distinct("project._id", { "project._id": { $in: distinctProjectIDs }, $or: [{ "manager._id": user._id }, { "leader._id": user._id }] })
        let userReleaseIDs = await MDL.ReleaseModel.distinct("_id", { "_id": { $in: distinctReleaseIDs }, $or: [{ "manager._id": user._id }, { "leader._id": user._id }] })
        if (!userProjectIDs || !userProjectIDs.length)
            return []

        let projects = await MDL.ProjectModel.find({ "_id": { $in: userProjectIDs } }, { name: 1 })
        let result = []
        if (projects && projects.length) {
            for (let project of projects) {
                let releases = await MDL.ReleaseModel.find({ "_id": { $in: userReleaseIDs }, "project._id": project._id }, { name: 1 })
                for (let release of releases) {
                    result.push({
                        releaseID: release._id,
                        projectID: project._id,
                        projectName: project.name,
                        releaseName: release.name
                    })
                }
            }
        }

        return result
    }
}

billingTaskSchema.statics.getBillingReleases = async (criteria, user) => {
    console.log("getBillingReleases called")
    let fromMoment = undefined
    let toMoment = undefined

    if (criteria.fromDate) {
        fromMoment = momentInUTC(criteria.fromDate)
    }

    if (criteria.toDate) {
        toMoment = momentInUTC(criteria.toDate)
    }

    let crit = {
        'client._id': mongoose.Types.ObjectId(criteria.clientID)
    }

    if (userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        // User would see all those clients which has billing tasks as per criteria
        if (fromMoment && toMoment && fromMoment.isValid() && toMoment.isValid()) {
            crit['$and'] = [{ 'billedDate': { $gte: fromMoment.toDate() } }, { 'billedDate': { $lte: toMoment.toDate() } }]
        } else if (fromMoment && fromMoment.isValid()) {
            crit['billedDate'] = { $gte: fromMoment.toDate() }
        } else if (toMoment && toMoment.isValid()) {
            crit['billedDate'] = { $lte: toMoment.toDate() }
        }

        let distinctReleaseIDs = await BillingTaskModel.distinct("release._id", crit)
        if (!distinctReleaseIDs || !distinctReleaseIDs.length)
            return []

        return await MDL.ReleaseModel.find({ "_id": { $in: distinctReleaseIDs } }, { name: 1, project: 1 })

    } else {
        // user would only see those clients which has billing tasks of releases this user is either leader or manager
        let distinctReleaseIDs = await BillingTaskModel.distinct("release._id", crit)
        console.log("distinct release IDs is ", distinctReleaseIDs)
        // Filter release ids that has this user as either manager or leader
        let userReleaseIDs = await MDL.ReleaseModel.distinct("_id", { "_id": { $in: distinctReleaseIDs }, $or: [{ "manager._id": user._id }, { "leader._id": user._id }] })
        if (!userReleaseIDs || !userReleaseIDs.length)
            return []

        return await MDL.ReleaseModel.find({ "_id": { $in: userReleaseIDs } }, { name: 1, project: 1 })
    }
}

billingTaskSchema.statics.getInReviewBillingPlans = async (criteria, user) => {
    if (!userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        throw new AppError('Only user with role [' + ROLE_TOP_MANAGEMENT + '] can search for billing tasks', ACCESS_DENIED, HTTP_FORBIDDEN)
    }

    let crit = {}
    if (criteria.clientID && criteria.clientID.trim().length > 0)
        crit['client._id'] = mongoose.Types.ObjectId(criteria.clientID)

    if (criteria.releaseID && criteria.releaseID.trim().length > 0)
        crit['release._id'] = mongoose.Types.ObjectId(criteria.releaseID)

    let fromMoment = undefined
    let toMoment = undefined
    if (criteria.fromDate) {
        fromMoment = momentInUTC(criteria.fromDate)
    }
    if (criteria.toDate) {
        toMoment = momentInUTC(criteria.toDate)
    }
    if (fromMoment && toMoment && fromMoment.isValid() && toMoment.isValid()) {
        crit['$and'] = [{ 'billedDate': { $gte: fromMoment.toDate() } }, { 'billedDate': { $lte: toMoment.toDate() } }]
    } else if (fromMoment && fromMoment.isValid()) {
        crit['billedDate'] = { $gte: fromMoment.toDate() }
    } else if (toMoment && toMoment.isValid()) {
        crit['billedDate'] = { $lte: toMoment.toDate() }
    }

    let billingTasks = await BillingTaskModel.aggregate([{
        $match: crit
    }, {
        $sort: { 'billedDate': 1 }
    }, {
        $project: {
            "release": 0,
            "project": 0,
            "client": 0,
            "billingRate": 0,
            "billingAmount": 0

        }
    }])

    let release = await MDL.ReleaseModel.findById(criteria.releaseID, { project: 1, client: 1, name: 1, "iterations.billedAmount": 1, "iterations.unbilledAmount": 1, "team": 1, "nonProjectTeam": 1 })
    if (billingTasks && billingTasks.length) {
        let releasePlans = []
        for (let billingTask of billingTasks) {
            logger.debug("Iterating on billing task " + billingTask._id)
            let idx = releasePlans.findIndex(r => r._id.toString() == billingTask.releasePlan._id.toString())
            if (idx == -1) {
                logger.debug("release plan not found in release plans ")
                let releasePlan = await MDL.ReleasePlanModel.findById(billingTask.releasePlan._id,
                    { 'task.name': 1, 'task.estimatedBilledHours': 1, 'report.progress': 1, 'report.unbilledAmount': 1, 'report.billingAmount': 1 }
                )

                let estimatedHours = releasePlan.task.estimatedBilledHours
                let earnedHours = parseFloat((releasePlan.report.progress * estimatedHours * 0.01).toFixed(2))
                let unbilledHours = releasePlan.report.unbilledHours ? releasePlan.report.unbilledHours : 0
                let billingHours = releasePlan.report.billingHours ? releasePlan.report.billingHours : 0
                let suggestedHours = earnedHours - billingHours - unbilledHours

                releasePlans.push({
                    _id: releasePlan._id,
                    name: releasePlan.task.name,
                    estimatedHours,
                    earnedHours,
                    unbilledHours,
                    billingHours,
                    suggestedHours,
                    billingTasks: [
                        Object.assign({}, billingTask, {
                            releasePlan: undefined,
                            billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT),
                            planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT)
                        })
                    ]
                })
            } else {
                // release plan entry is present
                let releasePlan = releasePlans[idx]
                logger.debug("release plan found in releaseplans ", { releasePlan })
                // We would have to add this billing task to appropriate task plan inside this release plan
                let billingTaskPlanIdx = releasePlan.billingTasks.findIndex(bt => bt._id.toString() == billingTask._id.toString())

                if (billingTaskPlanIdx == -1) {
                    releasePlan.billingTasks.push(Object.assign({}, billingTask, {
                        releasePlan: undefined,
                        billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT),
                        planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT)
                    }))
                } else {
                    logger.warn("not possible to have two billing tasks against a same task plan")
                }
            }
        }
        //let releasePlans = await processBillingTasks(billingTasks)
        return {
            releasePlans,
            release
        };
    } else {
        return {
            releasePlans: [],
            release
        }
    }
}

billingTaskSchema.statics.updateBillingTaskDescription = async (billingInput, user) => {
    let billingTask = await BillingTaskModel.findById(billingInput._id)
    // find release of this billing task
    if (!userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        // check to see if user is leader or manager of this release
        let release = await ReleaseModel.findById(billingTask.release._id, { "manager": 1, "leader": 1 })
        if (user._id.toString() !== release.manager._id.toString() && user._id.toString() !== release.leader._id.toString()) {
            // as user is not a top management user and is also not manager or leader of this release he cannot change description
            throw new AppError('Not authorized to change billing task description', ACCESS_DENIED, HTTP_FORBIDDEN)
        }
    }

    // User is authorized to change description
    billingTask.description = billingInput.description
    await billingTask.save()
    return {
        _id: billingTask._id,
        description: billingTask.description
    }
}

billingTaskSchema.statics.updateBillingTask = async (billingInput, user) => {
    let billingTask = await BillingTaskModel.findById(billingInput._id)
    // find release of this billing task
    if (!userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        // check to see if user is leader or manager of this release
        let release = await ReleaseModel.findById(billingTask.release._id, { "manager": 1, "leader": 1 })
        if (user._id.toString() !== release.manager._id.toString() && user._id.toString() !== release.leader._id.toString()) {
            // as user is not a top management user and is also not manager or leader of this release he cannot change description
            throw new AppError('Not authorized to change billing task', ACCESS_DENIED, HTTP_FORBIDDEN)
        }
    }

    // User is authorized to change description
    return billingTask
}


/*

billingTaskSchema.statics.searchBillingTask = async (criteria, user) => {
    if (!userHasRole(user, ROLE_TOP_MANAGEMENT)) {
        throw new AppError('Only user with role [' + ROLE_TOP_MANAGEMENT + '] can search for billing tasks', ACCESS_DENIED, HTTP_FORBIDDEN)
    }

    console.log('criteria received ', criteria)
    let crit = {
        'client._id': mongoose.Types.ObjectId(criteria.clientID),
        'release._id': mongoose.Types.ObjectId(criteria.releaseID)
    }

    let release = await MDL.ReleaseModel.findById(criteria.releaseID, { project: 1, client: 1, name: 1, "iterations.billedAmount": 1, "iterations.unbilledAmount": 1, "team": 1, "nonProjectTeam": 1 })

    // find out billing rate of client of this release
    let billingRate = await MDL.BillingRateModel.findOne({ "owner.type": OWNER_TYPE_CLIENT, "owner._id": release.client._id })

    if (!billingRate) {
        console.log("No billing rate found for client [" + client.name + "]")
        return;
    }

    logger.debug("release found as ", { release })

    let fromMoment = undefined
    let toMoment = undefined

    if (criteria.fromDate) {
        fromMoment = momentInUTC(criteria.fromDate)
    }

    if (criteria.toDate) {
        toMoment = momentInUTC(criteria.toDate)
    }

    if (fromMoment && toMoment && fromMoment.isValid() && toMoment.isValid()) {
        crit['$and'] = [{ 'billedDate': { $gte: fromMoment.toDate() } }, { 'billedDate': { $lte: toMoment.toDate() } }]
    } else if (fromMoment && fromMoment.isValid()) {
        crit['billedDate'] = { $gte: fromMoment.toDate() }
    } else if (toMoment && toMoment.isValid()) {
        crit['billedDate'] = { $lte: toMoment.toDate() }
    }

    let billingTasks = await BillingTaskModel.aggregate([{
        $match: crit
    }, {
        $sort: { 'billedDate': 1 }
    }, {
        $project: {
            "release": 0,
            "project": 0,
            "client": 0
        }
    }])

    if (billingTasks && billingTasks.length) {
        let releasePlans = await processBillingTasks(billingTasks, billingRate.billingRate)
        return {
            release,
            releasePlans
        };
    } else {
        return {
            release,
            releasePlans: []
        }
    }
}

const processBillingTasks = async (billingTasks, billingRate) => {
    let releasePlans = []
    for (let billingTask of billingTasks) {
        logger.debug("Iterating on billing task " + billingTask._id)
        let idx = releasePlans.findIndex(r => r._id.toString() == billingTask.releasePlan._id.toString())
        if (idx == -1) {
            logger.debug("release plan not found in release plans ")
            let releasePlan = await MDL.ReleasePlanModel.findById(billingTask.releasePlan._id,
                { 'task.name': 1, 'task.estimatedBilledHours': 1, 'report.progress': 1, 'report.unbilledAmount': 1, 'report.billingAmount': 1 }
            )

            let estimatedAmount = releasePlan.task.estimatedBilledHours * billingRate
            let earnedAmount = parseFloat((releasePlan.report.progress * estimatedAmount * 0.01).toFixed(2))
            let unbilledAmount = releasePlan.report.unbilledAmount ? releasePlan.report.unbilledAmount : 0
            let billingAmount = releasePlan.report.billingAmount ? releasePlan.report.billingAmount : 0
            let suggestedAmount = earnedAmount - unbilledAmount - billingAmount

            releasePlans.push({
                _id: releasePlan._id,
                name: releasePlan.task.name,
                estimatedAmount,
                earnedAmount,
                unbilledAmount,
                billingAmount,
                suggestedAmount,

                taskPlans: [{
                    _id: billingTask.taskPlan._id,
                    employeeName: billingTask.taskPlan.employee.name,
                    planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT),
                    reportedHours: billingTask.taskPlan.report.reportedHours,
                    description: billingTask.taskPlan.report.description,
                    billingTasks: [Object.assign({}, billingTask, {
                        taskPlan: undefined,
                        releasePlan: undefined,
                        billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                    })]
                }]
            })
        } else {
            // release plan entry is present
            let releasePlan = releasePlans[idx]
            logger.debug("release plan found in releaseplans ", { releasePlan })

            // We would have to add this billing task to appropriate task plan inside this release plan
            let taskPlanIdx = releasePlan.taskPlans.findIndex(tp => tp._id.toString() == billingTask.taskPlan._id.toString())
            if (taskPlanIdx == -1) {
                releasePlan.taskPlans.push({
                    _id: billingTask.taskPlan._id,
                    employeeName: billingTask.taskPlan.employee.name,
                    planningDate: momentInUTC(billingTask.taskPlan.planningDate).format(DATE_DISPLAY_FORMAT),
                    reportedHours: billingTask.taskPlan.report.reportedHours,
                    description: billingTask.taskPlan.report.description,
                    billingTasks: [Object.assign({}, billingTask, {
                        taskPlan: undefined,
                        releasePlan: undefined,
                        billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                    })]
                })
            } else {
                releasePlan.taskPlans[taskPlanIdx].billingTasks.push(Object.assign({}, billingTask, {
                    taskPlan: undefined,
                    releasePlan: undefined,
                    billedDate: momentInUTC(billingTask.billedDate).format(DATE_FORMAT)
                }))
            }
        }
    }

    return releasePlans;
}

*/


const BillingTaskModel = mongoose.model('BillingTask', billingTaskSchema)
export default BillingTaskModel
