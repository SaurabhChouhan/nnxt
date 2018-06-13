import Router from 'koa-router'
import * as MDL from '../models'

/**
 * This router would contain all API routes
 * @type {Router}
 */


const dashboardRouter = new Router({
    prefix: 'dashboard'
})

dashboardRouter.get('/', (ctx, next) => {
    return ctx.body = {}
})

export default dashboardRouter
