import Router from 'koa-router'
import * as MDL from "../models"



const holidayRouter = new Router({
    prefix: "holiday"
})

/**
 * Add all Holiday
 */
holidayRouter.post("/", async ctx => {
    console.log("inside router")
    return await MDL.YearlyHolidaysModel.createHoliday(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})
export default holidayRouter