import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import * as U from '../utils'
import AppError from '../AppError'

/***
 * Added prefix
 */

let releaseRouter = new Router({
    prefix: "/releases"
})

/***
 * Get all available release for drop-down  also
 ***/
releaseRouter.get("/", async ctx => {
    return await MDL.ReleaseModel.getAvailableReleases(ctx.state.user)
})


releaseRouter.post("/", async ctx => {
    return await MDL.ReleaseModel.createRelease(ctx.request.body, ctx.state.user)
})

releaseRouter.put("/", async ctx => {
    return await MDL.ReleaseModel.updateRelease(ctx.request.body, ctx.state.user)
})

/***
 * Get all releases
 ***/
releaseRouter.get("/mine/status/:status", async ctx => {
    return await MDL.ReleaseModel.getMyReleases(ctx.params.status, ctx.state.user)
})

releaseRouter.get("/all/status/:status", async ctx => {
    return await MDL.ReleaseModel.getAllReleases(ctx.params.status, ctx.state.user)
})

releaseRouter.post('/search', async ctx => {
    console.log("Inside release router search", ctx.request.body)
    return await MDL.ReleaseModel.search(ctx.request.body, ctx.state.user)
})

/***
 * Update Release dates to another date for re-schedule
 ***/
releaseRouter.put("/release-date", async ctx => {
    return await MDL.ReleaseModel.updateReleaseDates(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/***
 * Get release details by release Id
 ***/
releaseRouter.get("/release/:releaseID", async ctx => {
    return await MDL.ReleaseModel.getFullReleaseDetailsById(ctx.params.releaseID, ctx.state.user)
})

/***
 * Get release developer team details by using release Id
 ***/
releaseRouter.get("/release-plan/:releasePlanID/role/developers", async ctx => {
    return await MDL.ReleasePlanModel.getReleaseDevelopersByReleasePlanID(ctx.params.releasePlanID, ctx.state.user)

})

/***
 * Get release list in which logged in user is involved as a manager or leader or developer or non project developer
 ***/
releaseRouter.get("/:releaseID/details-for-reporting", async ctx => {
    return await MDL.ReleaseModel.getReleaseDetailsForReporting(ctx.params.releaseID, ctx.state.user)
})

/***
 * Get release Plan list in which logged in user is involved as a manager or leader or developer or non project developer  by release ID and release plan status
 ***/
releaseRouter.get("/:releaseID/status/:status/flag/:empflag/release-plans", async ctx => {
    let roleInRelease = await MDL.ReleaseModel.getUserRolesInReleaseById(ctx.params.releaseID, ctx.state.user)
    if (!U.includeAny([SC.ROLE_LEADER, SC.ROLE_MANAGER], roleInRelease)) {
        throw new AppError("Only user with role [" + SC.ROLE_MANAGER + " or " + SC.ROLE_LEADER + "] can see Release task list", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.ReleasePlanModel.getReleasePlansByReleaseID(ctx.params, ctx.state.user)
})

releaseRouter.get("/estimation/:estimationID", async ctx => {
    return await MDL.ReleaseModel.getAllReleasesToAddEstimation(ctx.params.estimationID, ctx.state.user)
})


/***
 * Shifting all task plans to future with base date and number of days to shift
 * - Can not shift to any holiday date
 * - Shift even task plan assigned on holiday to working days
 * - Can-not shift task plan to a future days leave from base date
 ***/
releaseRouter.put("/shift-future/", async ctx => {
    return await MDL.TaskPlanningModel.shiftTasksToFuture(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

/***
 * Shifting all task plans to past with base date and number of days to shift
 * - Can not shift to any holiday date
 * - Shift even task plan assigned on holiday to working days
 * - Can-not shift task plan to a past days leave from base date
 ***/
releaseRouter.put("/shift-past/", async ctx => {
    return await MDL.TaskPlanningModel.shiftTasksToPast(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/***
 * Add employee days detail of a employee of a particular date on task planning
 ***/
releaseRouter.post("/employee-days", async ctx => {
    let employeeDays = await MDL.EmployeeDaysModel.addEmployeeDaysDetails(ctx.request.body, ctx.state.user)
    if (!employeeDays) {
        throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeDays
})


/***
 * Get all employee days detail without any filter
 ***/
releaseRouter.get("/employee-days/:id", async ctx => {
    return await MDL.EmployeeDaysModel.getActiveEmployeeDays(ctx.state.user)

})


/***
 * Add employee statistics detail of a employee which is having all leaves and all task details by release
 ***/
releaseRouter.post("/employee-statistics/", async ctx => {
    return await MDL.EmployeeStatisticsModel.addEmployeeStatisticsDetails(ctx.request.body, ctx.state.user)
})


/***
 * get all employee statistics detail
 ***/
releaseRouter.get("/employee-statistics/:id", async ctx => {
    return await MDL.EmployeeStatisticsModel.getActiveEmployeeStatistics(ctx.state.user)
})

releaseRouter.get("/release-plan/:releasePlanID/iteration-data", async ctx => {
    return await MDL.ReleasePlanModel.findById(ctx.params.releasePlanID, {
        "release.iteration": 1
    })
})

releaseRouter.get('/fix-release-stats/:releaseID', async ctx => {
    return await MDL.ReleaseModel.fixReleaseStats(ctx.params.releaseID)
})

releaseRouter.get('/release-types', async ctx => {
    return SC.RELEASE_TYPES_WITH_LABELS
})

export default releaseRouter