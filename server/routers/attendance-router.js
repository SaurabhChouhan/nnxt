import Router from 'koa-router'
import {publicRouter, userRouter, permissionRouter, roleRouter, clientRouter, estimationRouter, projectRouter, technologyRouter} from "./"
import {isAuthenticated, isAdmin, isSuperAdmin, hasRole} from "../utils"
import AppError from '../AppError'
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import {AttendanceSettingsModel} from "../Models";
import {ROLE_NEGOTIATOR} from "../serverconstants";

/**
 * This router would contain all API routes
 * @type {Router}
 */


let attedanceRouter = new Router({
    prefix: "attendance"
})


attedanceRouter.get("/admin-attendance-settings", async ctx => {

    if (!hasRole(ctx, ROLE_SUPER_ADMIN) || !hasRole(ctx,ROLE_ADMIN))
        throw new AppError("Only users with role [" + ROLE_SUPER_ADMIN + "] or  [" + ROLE_ADMIN + "]  can access attedance settings.", ACCESS_DENIED, HTTP_FORBIDDEN)

    return await AttendanceSettingsModel.getAdminAttendanceSettings()
})
attedanceRouter.post("/admin-attendance-settings", async ctx => {

    if (!hasRole(ctx, ROLE_SUPER_ADMIN) || !hasRole(ctx,ROLE_ADMIN))
        throw new AppError("Only users with role [" + ROLE_SUPER_ADMIN + "] or  [" + ROLE_ADMIN + "]  can access attedance settings.", ACCESS_DENIED, HTTP_FORBIDDEN)

    return await AttendanceSettingsModel.updateAdminAttedanceSettings(ctx.request.body)
})
