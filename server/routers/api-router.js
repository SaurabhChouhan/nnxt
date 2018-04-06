import Router from 'koa-router'
import {
    attendanceRouter,
    clientRouter,
    estimationRouter,
    leaveRouter,
    permissionRouter,
    projectRouter,
    publicRouter,
    releaseRouter,
    repositoryRouter,
    roleRouter,
    technologyRouter,
    userRouter
} from "./"
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
apiRouter.use(publicRouter.routes())

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
}, userRouter.routes(), permissionRouter.routes(), roleRouter.routes(), clientRouter.routes(), estimationRouter.routes(), projectRouter.routes(), technologyRouter.routes(), leaveRouter.routes(), repositoryRouter.routes(), attendanceRouter.routes(), releaseRouter.routes())

export default apiRouter