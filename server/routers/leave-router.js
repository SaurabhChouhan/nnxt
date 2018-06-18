import Router from 'koa-router'
import * as MDL from "../models"
import * as SC from "../serverconstants"
import {hasRole} from "../utils"
import AppError from '../AppError'
import * as EC from '../errorcodes'


const leaveRouter = new Router({
    prefix: "leave"
})


/**
 * Get only leave setting
 */
leaveRouter.get("/leave-setting", async ctx => {
    return await MDL.LeaveSettingModel.getLeaveSettings(ctx.state.user)
})

/**
 * create leave Setting
 */
leaveRouter.post("/leave-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.LeaveSettingModel.createLeaveSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

/**
 * Update leave setting
 */
leaveRouter.put("/leave-setting", async ctx => {
    if (!hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.LeaveSettingModel.updateLeaveSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/**
 * Get all Leave types
 */
leaveRouter.get('/leave-types', async ctx => {
    return await MDL.LeaveTypeModel.getAllActiveLeaveTypes()
})

/**
 * Get all active leaves of loggedIn user
 */
leaveRouter.get("/:status", async ctx => {
    return await MDL.LeaveModel.getAllLeaves(ctx.params.status, ctx.state.user)
})

/**
 * Add all Leave  requested
 */
leaveRouter.post("/", async ctx => {
    return await MDL.LeaveModel.raiseLeaveRequest(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/**
 * Add all Leave  requested
 */
leaveRouter.del("/:leaveID", async ctx => {
    return await MDL.LeaveModel.deleteLeave(ctx.params.leaveID, ctx.state.user)
})

/**
 * Cancel Leave request
 */
leaveRouter.put("/:leaveID/cancel-request", async ctx => {
    return await MDL.LeaveModel.cancelLeaveRequest(ctx.params.leaveID, ctx.state.user)
})

/**
 * Delete Leave request
 */

export default leaveRouter