import Router from 'koa-router'
import * as MDL from "../models"


const leaveRouter = new Router({
    prefix: "leave"
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
leaveRouter.get('/leave-types', async ctx => {
    return await MDL.LeaveTypeModel.getAllActiveLeaveTypes()
})

export default leaveRouter