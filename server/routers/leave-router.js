import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"


const leaveRouter = new Router({
    prefix: "leave"
})

leaveRouter.post("/", async ctx => {

    V.validate(ctx.request.body, V.leaveRequestAdditionStruct)

    return await MDL.LeaveModel.saveLeave(ctx.request.body, ctx.state.user)
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