import Router from 'koa-router'
import * as MDL from "../models"

/**
 * This router would contain all API routes
 * @type {Router}
 */


const calenderRouter = new Router({
    prefix: "calenders"
})

calenderRouter.get("/holidays", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllYearlyHolidays(ctx.state.user)
})

calenderRouter.get("/holidays/after-base/:baseDate", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllYearlyHolidaysAfterBaseDate(ctx.params.baseDate, ctx.state.user)
})

calenderRouter.post("/holidays/", async ctx => {
    return await MDL.YearlyHolidaysModel.createHolidayYear(ctx.request.body, ctx.request.user)
})

calenderRouter.put("/add-holiday/", async ctx => {
    return await MDL.YearlyHolidaysModel.updateHolidayYear(ctx.request.body, ctx.request.user)
})
export default calenderRouter
