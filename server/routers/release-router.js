import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import _ from 'lodash'

/***
 * Added prefix
 */

let releaseRouter = new Router({
    prefix: "releases"
})

/***
 * Get all releases and by status filtering also
 ***/
releaseRouter.get("/status/:status", async ctx => {
    return await MDL.ReleaseModel.getReleases(ctx.params.status, ctx.state.user)
})

/***
 * Get release details by release Id
 ***/
releaseRouter.get("/release/:releaseID", async ctx => {

    let roleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(ctx.params.releaseID, ctx.state.user)
    if (!_.includes([SC.ROLE_LEADER, SC.ROLE_MANAGER], roleInRelease)) {
        throw new AppError("Only user with role [" + SC.ROLE_MANAGER + "or" + SC.ROLE_LEADER + "] can see Release list", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    return await MDL.ReleaseModel.getReleaseById(ctx.params.releaseID, roleInRelease, ctx.state.user)
})


/***
 * Get release plan details by release plan Id
 ***/
releaseRouter.get("/:releasePlanID/release-plan", async ctx => {
    return await MDL.ReleasePlanModel.getReleasePlanByID(ctx.params.releasePlanID, ctx.state.user)

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
//get release plan list  by releaseID and task status
releaseRouter.get("/:releaseID/status/:status/flag/:empflag/release-plans", async ctx => {

    let roleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(ctx.params.releaseID, ctx.state.user)
    if (!_.includes([SC.ROLE_LEADER, SC.ROLE_MANAGER], roleInRelease)) {
        throw new AppError("Only user with role [" + SC.ROLE_MANAGER + " or " + SC.ROLE_LEADER + "] can see Release task list", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    return await MDL.ReleasePlanModel.getReleasePlansByReleaseID(ctx.params, ctx.state.user)

})


// Add task planning by manager or leader
releaseRouter.put("/plan-task/", async ctx => {
    return await MDL.TaskPlanningModel.addTaskPlanning(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})


//Merge task plan to a perticular date
releaseRouter.put("/merge-task-plan/", async ctx => {
    return await MDL.TaskPlanningModel.mergeTaskPlanning(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

// shift tasks to future
releaseRouter.put("/shift-future/", async ctx => {
    return await MDL.TaskPlanningModel.planningShiftToFuture(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

// shift tasks to past
releaseRouter.put("/shift-past/", async ctx => {
    return await MDL.TaskPlanningModel.planningShiftToPast(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

// Delete task planning
releaseRouter.del("/plan-task/:planID", async ctx => {
    return await MDL.TaskPlanningModel.deleteTaskPlanning(ctx.params.planID, ctx.state.user)
})

// fetch task planning detail
releaseRouter.get("/task-plans/:releasePlanID", async ctx => {
    return await MDL.TaskPlanningModel.getReleaseTaskPlanningDetails(ctx.params.releasePlanID, ctx.state.user)

})

// get developer wise task planning schedule
releaseRouter.get("/task-plans/employee/:employeeID/fromDate/:fromDate/toDate/:toDate", async ctx => {
    return await MDL.TaskPlanningModel.getTaskPlanningDetailsByEmpIdAndFromDateToDate(ctx.params.employeeID, ctx.params.fromDate, ctx.params.toDate, ctx.state.user)

})

// add employee days details
releaseRouter.post("/employee-days", async ctx => {
    let employeeDays = await MDL.EmployeeDaysModel.addEmployeeDaysDetails(ctx.request.body, ctx.state.user)
    if (!employeeDays) {
        throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeDays
})


// get employee days details
releaseRouter.get("/employee-days/:id", async ctx => {

    return await MDL.EmployeeDaysModel.getActiveEmployeeDays(ctx.state.user)
})


releaseRouter.post("/employee-statistics/", async ctx => {
    let employeeStatistics = await MDL.EmployeeStatisticsModel.addEmployeeStatisticsDetails(ctx.request.body, ctx.state.user)
    if (!employeeStatistics) {
        throw new AppError("Not allowed to add statistics", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeStatistics
})

releaseRouter.get("/employee-statistics/:id", async ctx => {
    return await MDL.EmployeeStatisticsModel.getActiveEmployeeStatistics(ctx.state.user)
})

export default releaseRouter