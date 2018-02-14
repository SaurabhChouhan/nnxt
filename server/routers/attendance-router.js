import Router from 'koa-router'
import {isAuthenticated, userHasRole} from "../utils"
import AppError from '../AppError'
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import {AttendanceSettingsModel} from "../models"
import * as SC from '../serverconstants'

/**
 * This router would contain all API routes
 * @type {Router}
 */


const attendanceRouter = new Router({
    prefix: "attendance"
})

attendanceRouter.get("/attendance-settings", async ctx => {
    return await AttendanceSettingsModel.get(ctx.state.user)
})
attendanceRouter.post("/attendance-settings", async ctx => {

    return await AttendanceSettingsModel.updateSetting(ctx.request.body, ctx.request.user)
})
export default attendanceRouter
