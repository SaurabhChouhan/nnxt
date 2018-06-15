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
 * Get all Leave setting  by ID
 */
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

/**
 * Get all Leave types
 */
leaveRouter.get('/leave-types', async ctx => {
    return await MDL.LeaveTypeModel.getAllActiveLeaveTypes()
})

/**
 * Get all Leaves
 */
leaveRouter.get("/", async ctx => {
    return await MDL.LeaveModel.getAllActive(ctx.state.user)
})

/**
 * Add all Leave  requested
 */
leaveRouter.post("/", async ctx => {
    return await MDL.LeaveModel.leaveRaised(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

/**
 * Cancel Leave request
 */
leaveRouter.put("/cancel-request", async ctx => {
    return await MDL.LeaveModel.cancelLeaveRequest(ctx.request.body)
})

/**
 * Delete Leave request
 */

leaveRouter.del("/:leaveID/delete-request", async ctx => {
    return await MDL.LeaveModel.deleteLeaveRequest(ctx.params.leaveID)
})

export default leaveRouter