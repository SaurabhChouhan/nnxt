import Router from 'koa-router'
import {LeaveModel} from "../models"
import {leaveRequestAdditionStruct,generateSchema,validate} from "../validation"


const leaveRouter = new Router({
    prefix: "leave"
})

leaveRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(leaveRequestAdditionStruct)

    return await LeaveModel.saveLeave(ctx.request.body)
})
leaveRouter.get("/", async ctx => {
    return await LeaveModel.getAllActive(ctx.state.user)
})
leaveRouter.put("/cancel-request", async ctx => {

    console.log("You are in leave router cancelLeaveRequest",ctx.request.body)

    return await LeaveModel.cancelLeaveRequest(ctx.request.body)
})



export default leaveRouter