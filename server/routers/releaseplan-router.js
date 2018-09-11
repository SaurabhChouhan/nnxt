import Router from 'koa-router'
import * as MDL from "../models";

let releasePlanRouter = new Router({
    prefix: "release-plans"
})

releasePlanRouter.post("/add-planned-task", async ctx => {
    return await MDL.ReleasePlanModel.addPlannedReleasePlan(ctx.request.body, ctx.state.user)
})

releasePlanRouter.post("/add-unplanned-task", async ctx => {
    return await MDL.ReleasePlanModel.addUnplannedReleasePlan(ctx.request.body, ctx.state.user)
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

/**
 * Manager/Leader would able to delete those release-tasks that don't have any day-task associated with them. Currently it would not be able
 * to delete tasks that are added to release from estimation.
 */
releasePlanRouter.del('/:releasePlanID', async ctx => {
    console.log("inside delete release plan id")
    return await MDL.ReleasePlanModel.removeReleasePlanById(ctx.params.releasePlanID, ctx.state.user)
})

releasePlanRouter.put('/update-planned_task', async ctx=>{
    return await MDL.ReleasePlanModel.updatePlannedReleasePlan(ctx.request.body, ctx.state.user)
})

export default releasePlanRouter