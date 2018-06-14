import Router from 'koa-router'
import * as MDL from "../models"
import {isAdmin, isSuperAdmin} from "../utils"
import AppError from '../AppError'
import * as EC from '../errorcodes'


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


holidayRouter.get("/years/", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllHolidayYearsFromServer(ctx.state.user)
})

holidayRouter.get("/holidays/:year/year", async ctx => {
    return await MDL.YearlyHolidaysModel.getAllHolidaysOfYearFromServer(ctx.params.year, ctx.state.user)
})

holidayRouter.del('/:holidayDateString', async (ctx) => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await MDL.YearlyHolidaysModel.deleteHolidayFromYear(ctx.params.holidayDateString)
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

holidayRouter.put('/', async ctx => {
    return await MDL.YearlyHolidaysModel.updateHolidayYear(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})


export default holidayRouter