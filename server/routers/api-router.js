import Router from 'koa-router'
import {publicRouter, userRouter, permissionRouter, roleRouter} from "./"
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
    console.log("ctx.user.state", ctx.state.user)
    if (isAuthenticated(ctx)) {
        return await next()
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, 403)
    }
}, userRouter.routes(), permissionRouter.routes(), roleRouter.routes())

export default apiRouter