import Router from 'koa-router'
import {ReleaseModel, ReleasePlanModel, TaskPlanningModel,EmployeeDaysModel,EmployeeStatisticsModel} from "../models"
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
       let planTask = await TaskPlanningModel.addTaskPlanningDetails(ctx.request.body, ctx.state.user)
       if (!planTask) {
           throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
       }
       return planTask
})

releaseRouter.post("/employee-days/", async ctx => {
       let employeeDays = await EmployeeDaysModel.addEmployeeDaysDetails(ctx.request.body, ctx.state.user)
       if (!employeeDays) {
           throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
       }
       return employeeDays
})

releaseRouter.post("/employee-statistics/", async ctx => {
       let employeeStatistics = await EmployeeStatisticsModel.addEmployeeStatisticsDetails(ctx.request.body, ctx.state.user)
       if (!employeeStatistics) {
           throw new AppError("Not allowed to plan the task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
       }
       return employeeStatistics
})




export default releaseRouter