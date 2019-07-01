import Router from 'koa-router'
import * as MDL from "../models"
import * as SC from "../serverconstants"
import * as EC from '../errorcodes'
import {hasRole} from "../utils"
import AppError from '../AppError'

const employeeRouter = new Router({
    prefix: "/employees"
})
/**
 * Get all Employee setting  by ID
 */
employeeRouter.get("/employee-setting", async ctx => {
    return await MDL.EmployeeSettingModel.getEmployeeSettings(ctx.state.user)
})
/**
 * Add Employee Setting
 */
employeeRouter.post("/employee-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.EmployeeSettingModel.createEmployeeSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})
/**
 * Update Employee Setting
 */
employeeRouter.put("/employee-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.EmployeeSettingModel.updateEmployeeSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/*
* Employee Schedule*/
employeeRouter.get("/:employeeID/from/:from/employee-schedule", async ctx => {
    return await MDL.EmployeeDaysModel.getEmployeeSchedule(ctx.params.employeeID, ctx.params.from, ctx.state.user)
})

employeeRouter.get("/:employeeID/employee-schedule/:month/year/:year", async ctx => {
    return await MDL.EmployeeDaysModel.getMonthlyWorkCalendar(ctx.params.employeeID, ctx.params.month, ctx.params.year, ctx.state.user)
})

employeeRouter.get("/:employeeID/employee-schedule/:month/year/:year/release/:releaseID", async ctx => {
    return await MDL.EmployeeDaysModel.getMonthlyWorkCalendar(ctx.params.employeeID, ctx.params.month, ctx.params.year, ctx.state.user, ctx.params.releaseID)
})


employeeRouter.post('/work-calendar', async ctx => {
    console.log("params in employee router", ctx.body)
    return await MDL.EmployeeDaysModel.getMonthlyWorkCalendar(ctx.request.body.employeeID, ctx.request.body.releaseTypes, ctx.request.body.month, ctx.request.body.year, ctx.state.user, ctx.request.body.releaseID)
})

export default employeeRouter
