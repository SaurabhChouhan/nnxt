import Router from 'koa-router'
import * as MDL from "../models";

let releasePlanRouter = new Router({
    prefix: "release-plans"
})

releasePlanRouter.post("/search", async ctx => {
    return await MDL.ReleasePlanModel.search(ctx.request.body, ctx.state.user)
})

/***
 * Get release plan details by release plan Id
 ***/
releasePlanRouter.get("/:releasePlanID", async ctx => {
    return await MDL.ReleasePlanModel.getReleasePlanByID(ctx.params.releasePlanID, ctx.state.user)

})


export default releasePlanRouter