import Router from 'koa-router'
import {EmployeeDaysModel, EmployeeStatisticsModel, ReleaseModel, ReleasePlanModel, TaskPlanningModel} from "../models"
import * as EC from '../errorcodes'
import AppError from '../AppError'

let releaseRouter = new Router({
    prefix: "releases"
})

releaseRouter.get("/status/:status", async ctx => {
    return await ReleaseModel.getReleases(ctx.params.status, ctx.state.user)
})

releaseRouter.get("/:releaseID", async ctx => {
    let release = await ReleaseModel.getReleaseById(ctx.params.releaseID, ctx.state.user)
    if (!release) {
        throw new AppError("Not allowed to release details", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return release
})

releaseRouter.get("/:releaseID/release-plans-with/status/:status/empflag/:empflag", async ctx => {
    let releasePlans = await ReleasePlanModel.getReleasePlansByReleaseID(ctx.params, ctx.state.user)
    if (!releasePlans) {
        throw new AppError("Not allowed to releases plans details", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return releasePlans
})

releaseRouter.put("/plan-task/", async ctx => {
    return await TaskPlanningModel.addTaskPlanning(ctx.request.body, ctx.state.user)
})

releaseRouter.del("/plan-task/:planID", async ctx => {
    return await TaskPlanningModel.deleteTaskPlanning(ctx.params.planID, ctx.state.user)
})

releaseRouter.get("/task-plans/:taskId", async ctx => {
    let taskPlans = await TaskPlanningModel.getTaskPlanningDetails(ctx.params.taskId, ctx.state.user)

    return taskPlans
})

releaseRouter.get("/task-plans/employee/:employeeId/fromDate/:fromDate/toDate/:toDate", async ctx => {
    let DeveloperDetails = await TaskPlanningModel.getTaskPlanningDetailsByEmpIdAndFromDateToDate(ctx.params.employeeId, ctx.params.fromDate, ctx.params.toDate, ctx.state.user)

    return DeveloperDetails
})
releaseRouter.post("/employee-days", async ctx => {
    let employeeDays = await EmployeeDaysModel.addEmployeeDaysDetails(ctx.request.body, ctx.state.user)
    if (!employeeDays) {
        throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeDays
})

releaseRouter.get("/employee-days/:id", async ctx => {

    return await EmployeeDaysModel.getActiveEmployeeDays(ctx.state.user)
})

releaseRouter.post("/employee-statistics/", async ctx => {
    let employeeStatistics = await EmployeeStatisticsModel.addEmployeeStatisticsDetails(ctx.request.body, ctx.state.user)
    if (!employeeStatistics) {
        throw new AppError("Not allowed to add statistics", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return employeeStatistics
})

releaseRouter.get("/employee-statistics/:id", async ctx => {
    return await EmployeeStatisticsModel.getActiveEmployeeStatistics(ctx.state.user)
})


export default releaseRouter