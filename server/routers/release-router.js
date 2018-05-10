import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import AppError from '../AppError'

// Added prefix
let releaseRouter = new Router({
    prefix: "releases"
})

//get all releases by status and all status
releaseRouter.get("/status/:status", async ctx => {
    return await MDL.ReleaseModel.getReleases(ctx.params.status, ctx.state.user)
})

//get single release detail by ID
releaseRouter.get("/release/:releaseID", async ctx => {

    let roleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(ctx.params.releaseID, ctx.state.user)
    if (roleInRelease !== SC.ROLE_LEADER || roleInRelease !== SC.ROLE_MANAGER) {
        throw new AppError("Only user with role [" + SC.ROLE_MANAGER + "or" + SC.ROLE_LEADER + "] can see Release list", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    return await MDL.ReleaseModel.getReleaseById(ctx.params.releaseID, ctx.state.user)
})

//get single release detail by ID and task status
releaseRouter.get("/:releaseID/release-plans-with/status/:status/empflag/:empflag", async ctx => {

    let roleInRelease = await MDL.ReleaseModel.getUserHighestRoleInThisRelease(ctx.params.releaseID, ctx.state.user)
    if (roleInRelease !== SC.ROLE_LEADER || roleInRelease !== SC.ROLE_MANAGER) {
        throw new AppError("Only user with role [" + SC.ROLE_MANAGER + "or" + SC.ROLE_LEADER + "] can see Release task list", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    return await MDL.ReleasePlanModel.getReleasePlansByReleaseID(ctx.params, ctx.state.user)

})


// Add task planning by manager or leader
releaseRouter.put("/plan-task/", async ctx => {
    return await MDL.TaskPlanningModel.addTaskPlanning(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})


//Merge task plan to a perticular date
releaseRouter.put("/merge-task-plan/", async ctx => {
    return await MDL.TaskPlanningModel.mergeTaskPlanning(ctx.request.body, ctx.state.user)
})

// shift tasks to future
releaseRouter.put("/shift-future/", async ctx => {
    console.log("shift-future", ctx.request.body)
    return await MDL.TaskPlanningModel.planningShiftToFuture(ctx.request.body, ctx.state.user)

})

// shift tasks to past
releaseRouter.put("/shift-past/", async ctx => {
    console.log("shift-past", ctx.request.body)
    return await MDL.TaskPlanningModel.planningShiftToPast(ctx.request.body, ctx.state.user)
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

//report

releaseRouter.get("/report", async ctx => {
    return await MDL.ReleaseModel.getAllReportingProjects(ctx.state.user)
})

//report/task-plans/release/' + releaseID + '/date/' + planDate + '/task-status/' + taskStatus
releaseRouter.get("/report/task-plans/release/:releaseID/date/:planDate/task-status/:taskStatus", async ctx => {
    return await MDL.ReleaseModel.getTaskPlanedForEmployee(ctx.params, ctx.state.user)
})

export default releaseRouter