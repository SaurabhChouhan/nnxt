import Router from 'koa-router'
import * as MDL from "../models";

let releasePlanRouter = new Router({
    prefix: "release-plans"
})

releasePlanRouter.post("/search", async ctx => {
    return await MDL.ReleasePlanModel.search(ctx.request.body, ctx.state.user)
})

export default releasePlanRouter