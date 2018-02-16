import Router from 'koa-router'
import { LeaveModel, LeaveTypeModel} from "../models"
import {leaveRequestAdditionStruct,generateSchema,validate} from "../validation"


const leaveRouter = new Router({
    prefix: "leave"
})

leaveRouter.post("/", async ctx => {

    validate(ctx.request.body, leaveRequestAdditionStruct)

    return await LeaveModel.saveLeave(ctx.request.body,ctx.state.user)
})
leaveRouter.get("/", async ctx => {
    return await LeaveModel.getAllActive(ctx.state.user)
})
leaveRouter.put("/cancel-request", async ctx => {

    console.log("You are in leave router cancelLeaveRequest",ctx.request.body)

    return await LeaveModel.cancelLeaveRequest(ctx.request.body)
})
leaveRouter.get('/leave-types', async ctx => {
    return await LeaveTypeModel.getAllActiveLeaveTypes()
})

export default leaveRouter