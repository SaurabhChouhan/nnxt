import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import AppError from '../AppError'

let releaseRouter = new Router({
    prefix: "releases"
})

releaseRouter.get("/status/:status", async ctx => {
    return await MDL.ReleaseModel.getReleases(ctx.params.status, ctx.state.user)
})

releaseRouter.get("/:releaseID", async ctx => {
    let release = await MDL.ReleaseModel.getReleaseById(ctx.params.releaseID, ctx.state.user)
    if (!release) {
        throw new AppError("Not allowed to release details", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return release
})

releaseRouter.get("/:releaseID/release-plans-with/status/:status/empflag/:empflag", async ctx => {
    let releasePlans = await MDL.ReleasePlanModel.getReleasePlansByReleaseID(ctx.params, ctx.state.user)
    if (!releasePlans) {
        throw new AppError("Not allowed to releases plans details", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return releasePlans
})

releaseRouter.put("/plan-task/", async ctx => {
    return await MDL.TaskPlanningModel.addTaskPlanning(ctx.request.body, ctx.state.user)
})


releaseRouter.put("/shift-future/", async ctx => {
    console.log("shift-future", ctx.request.body)
    return await MDL.TaskPlanningModel.planningShiftToFuture(ctx.request.body, ctx.state.user)

})

releaseRouter.put("/shift-past/", async ctx => {
    console.log("shift-past", ctx.request.body)
    return await MDL.TaskPlanningModel.planningShiftToPast(ctx.request.body, ctx.state.user)
})

releaseRouter.del("/plan-task/:planID", async ctx => {
    return await MDL.TaskPlanningModel.deleteTaskPlanning(ctx.params.planID, ctx.state.user)
})

releaseRouter.get("/task-plans/:taskId", async ctx => {
    return await MDL.TaskPlanningModel.getReleaseTaskPlanningDetails(ctx.params.taskId, ctx.state.user)

})

releaseRouter.get("/task-plans/employee/:employeeId/fromDate/:fromDate/toDate/:toDate", async ctx => {
    return await MDL.TaskPlanningModel.getTaskPlanningDetailsByEmpIdAndFromDateToDate(ctx.params.employeeId, ctx.params.fromDate, ctx.params.toDate, ctx.state.user)

})
releaseRouter.post("/employee-days", async ctx => {
    let employeeDays = await MDL.EmployeeDaysModel.addEmployeeDaysDetails(ctx.request.body, ctx.state.user)
    if (!employeeDays) {
        throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeDays
})

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