import Router from 'koa-router'
import * as MDL from "../models"
import * as SC from "../serverconstants"
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as U from '../utils'


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
    if (!U.hasRole(ctx, SC.ROLE_ADMIN)) {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
    return await MDL.LeaveSettingModel.createLeaveSettings(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

/**
 * Update leave setting
 */
leaveRouter.put("/leave-setting", async ctx => {
    if (!U.hasRole(ctx, SC.ROLE_ADMIN)) {
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
 *Delete Leave request
 */
leaveRouter.del("/:leaveID", async ctx => {
    return await MDL.LeaveModel.deleteLeave(ctx.params.leaveID, ctx.state.user)
})

/**
 * Cancel Leave request
 */
leaveRouter.put("/:leaveID/cancel-request/:reason", async ctx => {
    if (U.isHighestManagementRole(ctx)) {
        return await MDL.LeaveModel.cancelLeaveRequest(ctx.params.leaveID, ctx.params.reason, ctx.state.user)
    } else {
        throw new AppError("Only role with " + SC.ROLE_HIGHEST_MANAGEMENT_ROLE + " can cancel request ", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

})

/**
 * approve Leave Request
 */

leaveRouter.put("/:leaveID/approve-request/:reason", async ctx => {
    if (U.isHighestManagementRole(ctx)) {
        return await MDL.LeaveModel.approveLeaveRequest(ctx.params.leaveID, ctx.params.reason, ctx.state.user)
    } else {
        throw new AppError("Only role with " + SC.ROLE_HIGHEST_MANAGEMENT_ROLE + " can approve ", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

export default leaveRouter