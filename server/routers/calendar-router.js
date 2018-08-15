import Router from 'koa-router'
import * as MDL from "../models"

/**
 * This router would contain all API routes
 * @type {Router}
 */


const calendarRouter = new Router({
    prefix: "calendars"
})

calendarRouter.get("/holidays", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllYearlyHolidays(ctx.state.user)
})

calendarRouter.get("/holidays/from/:startDate/to/:endDate", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllYearlyHolidaysBaseDateToEnd(ctx.params.startDate, ctx.params.endDate, ctx.state.user)
})

calendarRouter.post("/holidays/", async ctx => {
    return await MDL.YearlyHolidaysModel.createHolidayYear(ctx.request.body, ctx.state.user)
})

calendarRouter.post("/holiday/", async ctx => {
    return await MDL.YearlyHolidaysModel.createHoliday(ctx.request.body, ctx.state.user)
})

calendarRouter.put("/add-holiday/", async ctx => {
    return await MDL.YearlyHolidaysModel.updateHolidayYear(ctx.request.body, ctx.state.user)
})

calendarRouter.get("/tasks", async ctx => {
    return await MDL.TaskPlanningModel.getAllTaskPlanningsForCalenderOfUser(ctx.state.user)
})

calendarRouter.get("/task-details/task-plan/:taskID", async ctx => {
    return await MDL.TaskPlanningModel.getTaskAndProjectDetailForCalenderOfUser(ctx.params.taskID, ctx.state.user)
})

export default calendarRouter
