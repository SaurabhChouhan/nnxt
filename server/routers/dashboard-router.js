import Router from 'koa-router'
import * as MDL from '../models'

/**
 * This router would contain all API routes
 * @type {Router}
 */


const dashboardRouter = new Router({
    prefix: 'dashboard'
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


/*Email Notification APIs*/
dashboardRouter.get('/email-template', async (ctx) => {
    return MDL.EmailTemplatesModel.getAllTemplates(ctx.state.user)
})

dashboardRouter.post('/email-template', async (ctx) => {
    return MDL.EmailTemplatesModel.addTemplate(ctx.state.user,ctx.request.body)
})

dashboardRouter.put('/email-template', async (ctx) => {
    return MDL.EmailTemplatesModel.updateTemplate(ctx.state.user,ctx.request.body)
})

dashboardRouter.put('/approved-email-template/:id', async (ctx) => {
    return MDL.EmailTemplatesModel.approvedTemplate(ctx.state.user,ctx.params.id)
})

dashboardRouter.del('/email-template/:id', async (ctx) => {
    return MDL.EmailTemplatesModel.deleteTemplate(ctx.state.user,ctx.params.id)
})

export default dashboardRouter
