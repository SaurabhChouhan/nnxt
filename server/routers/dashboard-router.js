import Router from 'koa-router'
import * as MDL from '../models'
import {sendEmailNotification} from '../notifications/byemail/notificationUtil'

/**
 * This router would contain all API routes
 * @type {Router}
 */


const dashboardRouter = new Router({
    prefix: '/dashboard'
})

dashboardRouter.get('/', (ctx) => {
    return ctx.body = {}
})

dashboardRouter.get('/day-plannings/:releaseID/month/:month/year/:year', async (ctx, next) => {
    return await MDL.TaskPlanningModel.getReleaseDayPlannings(ctx.params.releaseID, ctx.params.month, ctx.params.year, ctx.state.user);
})

dashboardRouter.post('/release-data', async (ctx) => {
    return MDL.ReleaseModel.getReleaseDataForDashboard(ctx.request.body, ctx.state.user)
})

export default dashboardRouter
