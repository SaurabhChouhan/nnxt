import Router from 'koa-router'
import {LeaveModel} from "../models"
import {leaveRequestAdditionStruct,generateSchema,validate} from "../validation"

const leaveRouter = new Router({
    prefix: "leave"
})

leaveRouter.post("/require", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(leaveRequestAdditionStruct)

    return await LeaveModel.saveLeave(ctx.request.body)
})

export default leaveRouter