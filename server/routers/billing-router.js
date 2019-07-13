import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"


let billingRouter = new Router({
    prefix: "/billings"
})


billingRouter.post('/billing-clients', async ctx => {
    V.validate(ctx.request.body, V.billingTaskBillingClientsStruct)
    return await MDL.BillingTaskModel.getBillingClients(ctx.request.body, ctx.state.user)
})

billingRouter.post('/billing-releases', async ctx => {
    V.validate(ctx.request.body, V.billingTaskBillingReleasesStruct)
    return await MDL.BillingTaskModel.getBillingReleases(ctx.request.body, ctx.state.user)
})

billingRouter.post("/inreview-billing-plans", async ctx => {
    V.validate(ctx.request.body, V.billingTaskSearchStruct)
    return await MDL.BillingTaskModel.getInReviewBillingPlans(ctx.request.body, ctx.state.user)
})

billingRouter.post("/add-billing-task-description", async ctx => {
    return await MDL.BillingTaskModel.updateBillingTaskDescription(ctx.request.body, ctx.state.user)
})

billingRouter.put("/billing-task", async ctx => {
    return await MDL.BillingTaskModel.updateBillingTask(ctx.request.body, ctx.state.user)
})

export default billingRouter