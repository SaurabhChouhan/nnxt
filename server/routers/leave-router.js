import Router from 'koa-router'
import * as MDL from "../models"
import * as SC from "../serverconstants"
import {hasRole} from "../utils"
import AppError from '../AppError'
import * as EC from '../errorcodes'


const leaveRouter = new Router({
    prefix: "leaves"
})

leaveRouter.post("/", async ctx => {
    return await MDL.LeaveModel.saveLeave(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

leaveRouter.get("/", async ctx => {
    return await MDL.LeaveModel.getAllActive(ctx.state.user)
})

leaveRouter.put("/cancel-request", async ctx => {
    return await MDL.LeaveModel.cancelLeaveRequest(ctx.request.body)
})

leaveRouter.del("/:leaveID/delete-request", async ctx => {
    return await MDL.LeaveModel.deleteLeaveRequest(ctx.params.leaveID)
})

leaveRouter.get('/leave-types', async ctx => {
    return await MDL.LeaveTypeModel.getAllActiveLeaveTypes()
})

leaveRouter.get("/leave-setting", async ctx => {
    return await MDL.LeaveSettingModel.getLeaveSettings(ctx.state.user)
})
/**
 * Add Leave Setting
 */
leaveRouter.post("/leave-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.LeaveSettingModel.createLeaveSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})
/**
 * Update Leave Setting
 */
leaveRouter.put("/leave-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.LeaveSettingModel.updateLeaveSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

export default leaveRouter