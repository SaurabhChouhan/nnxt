import Router from 'koa-router'
import * as RR from "../routers"
import {isAuthenticated} from "../utils"
import AppError from '../AppError'
import * as EC from "../errorcodes"

/**
 * This router would contain all API routes
 * @type {Router}
 */


const apiRouter = new Router({
    prefix: "/api"
})

// public URLs
apiRouter.use(RR.publicRouter.routes())

apiRouter.use(async (ctx, next) => {
    if (ctx.request.query && typeof(ctx.request.query.schema) != 'undefined') {
        // User is requesting schema for this API
        ctx.schemaRequested = true
        return await next()
    } else if (isAuthenticated(ctx)) {
        return await next()
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, 403)
    }
    }, RR.userRouter.routes(),
    RR.permissionRouter.routes(),
    RR.roleRouter.routes(),
    RR.clientRouter.routes(),
    RR.estimationRouter.routes(),
    RR.projectRouter.routes(),
    RR.technologyRouter.routes(),
    RR.leaveRouter.routes(),
    RR.repositoryRouter.routes(),
    RR.attendanceRouter.routes(),
    RR.releaseRouter.routes(),
    RR.calendarRouter.routes(),
    RR.reportingRouter.routes(),
    RR.employeeRouter.routes()
)

export default apiRouter