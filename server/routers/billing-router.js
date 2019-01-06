import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"


let billingRouter = new Router({
    prefix: "/billings"
})

billingRouter.post("/search-billing-tasks", async ctx => {
    V.validate(ctx.request.body, V.billingTaskSearchStruct)
    return await MDL.BillingTaskModel.searchBillingTask(ctx.request.body, ctx.state.user)
})


export default billingRouter