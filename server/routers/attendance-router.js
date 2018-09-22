import Router from 'koa-router'
import * as MDL from "../models"

/**
 * This router would contain all API routes
 * @type {Router}
 */


const attendanceRouter = new Router({
    prefix: "/attendance"
})

attendanceRouter.get("/attendance-settings", async ctx => {
    return await MDL.AttendanceSettingsModel.get(ctx.state.user)
})
attendanceRouter.post("/attendance-settings", async ctx => {
    return await MDL.AttendanceSettingsModel.updateSetting(ctx.request.body, ctx.state.user)
})
export default attendanceRouter
