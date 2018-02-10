import Router from 'koa-router'
import {isAuthenticated, isAdmin, isSuperAdmin, hasRole} from "../utils"
import AppError from '../AppError'
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import {AttendanceSettingsModel} from "../models"
import {
    ROLE_SUPER_ADMIN, ROLE_ADMIN
} from "../serverconstants";

/**
 * This router would contain all API routes
 * @type {Router}
 */


const attendanceRouter = new Router({
    prefix: "attendance"
})




attendanceRouter.get("/admin-attendance-settings", async ctx => {

    if (!isAdmin || !isSuperAdmin)
        throw new AppError("Only users with role [" + ROLE_SUPER_ADMIN + "] or  [" + ROLE_ADMIN + "]  can access attedance settings.", ACCESS_DENIED, HTTP_FORBIDDEN)

    return await AttendanceSettingsModel.getAdminAttendanceSettings(ctx.state.user)
})
attendanceRouter.post("/admin-attendance-settings", async ctx => {

    if (!isAdmin || !isSuperAdmin)
        throw new AppError("Only users with role [" + ROLE_SUPER_ADMIN + "] or  [" + ROLE_ADMIN + "]  can access attedance settings.", ACCESS_DENIED, HTTP_FORBIDDEN)

    return await AttendanceSettingsModel.updateAdminAttedanceSettings(ctx.request.body,ctx.request.user)
})
export default attendanceRouter
