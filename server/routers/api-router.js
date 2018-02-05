import Router from 'koa-router'
import {publicRouter, userRouter, permissionRouter, roleRouter, clientRouter, estimationRouter, projectRouter, technologyRouter,leaveRouter} from "./"
import {isAuthenticated, isAdmin, isSuperAdmin} from "../utils"
import AppError from '../AppError'
import {ACCESS_DENIED} from "../errorcodes"

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
    console.log("ctx.state.user", ctx.state.user,isAuthenticated(ctx))
    if (ctx.request.query && typeof(ctx.request.query.schema)!= 'undefined') {
        // User is requesting schema for this API
        ctx.schemaRequested = true
        return await next()
    } else if (isAuthenticated(ctx)) {
        return await next()
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, 403)
    }
}, userRouter.routes(), permissionRouter.routes(), roleRouter.routes(), clientRouter.routes(), estimationRouter.routes(), projectRouter.routes(), technologyRouter.routes(),leaveRouter.routes())

export default apiRouter