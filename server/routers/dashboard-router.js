import Router from 'koa-router'
import * as MDL from '../models'
import NotificationUtil from '../notifications/byemail/notificationUtil'
import generateOTPUtil from '../notifications/generateOTP'
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


/*Email Notification APIs*/
dashboardRouter.post('/email-template-type', async (ctx) => {
    return MDL.EmailTemplateTypeModel.addTemplateType(ctx.state.user,ctx.request.body)
})

dashboardRouter.get('/email-template-types', async (ctx) => {
    return MDL.EmailTemplateTypeModel.getAllTemplateTypes(ctx.state.user)
})

dashboardRouter.get('/verify-email-template-type/:templatetype', async (ctx) => {
    return MDL.EmailTemplateTypeModel.isExistThisTemplateType(ctx.params.templatetype)
})


dashboardRouter.get('/verify-email-template-name/:templatename', async (ctx) => {
    return MDL.EmailTemplatesModel.isExistThisTemplateName(ctx.params.templatename)
})

dashboardRouter.get('/email-template/type/:type', async (ctx) => {
    return MDL.EmailTemplatesModel.getAllTemplates(ctx.state.user,ctx.params.type)
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

dashboardRouter.get('/send-email-template', async (ctx) => {
    let emailData = {
        user:{
            _id:"5b87dea2749236069ce69430",
            email : "kgour@aripratech.com",
            firstName: "Kamlesh",
            lastName: "Gour"
        },
        userWelcomeMessage:"Welcome to nnxt"
    }
    return NotificationUtil.sendNotification(emailData,"Welcome-Template")
})

export default dashboardRouter
