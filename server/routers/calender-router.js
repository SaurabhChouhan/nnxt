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

calenderRouter.get("/holidays/from/:startDate/to/:endDate", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllYearlyHolidaysBaseDateToEnd(ctx.params.startDate, ctx.params.endDate, ctx.state.user)
})

calenderRouter.post("/holidays/", async ctx => {
    return await MDL.YearlyHolidaysModel.createHolidayYear(ctx.request.body, ctx.request.user)
})

calenderRouter.post("/holiday/", async ctx => {
    return await MDL.YearlyHolidaysModel.createHoliday(ctx.request.body, ctx.request.user)
})

calenderRouter.put("/add-holiday/", async ctx => {
    return await MDL.YearlyHolidaysModel.updateHolidayYear(ctx.request.body, ctx.request.user)
})

calenderRouter.get("/calender/tasks", async ctx => {
    return await MDL.TaskPlanningModel.getAllTaskPlanningsForCalenderOfUser(ctx.request.user)
})
export default calenderRouter
