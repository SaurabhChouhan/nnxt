import Router from 'koa-router'
import * as MDL from "../models"
import dashboardRouter from "./dashboard-router";

const templateRouter = new Router({
    prefix: "/templates"
})

templateRouter.get('/', async (ctx) => {
    return MDL.TemplateModel.getAllTemplates(ctx.state.user)
})

dashboardRouter.post('/', async (ctx) => {
    return MDL.TemplateModel.addTemplate(ctx.state.user, ctx.request.body)
})

dashboardRouter.put('/', async (ctx) => {
    return MDL.TemplateModel.updateTemplate(ctx.state.user, ctx.request.body)
})

dashboardRouter.del('/:id', async (ctx) => {
    return MDL.TemplateModel.deleteTemplate(ctx.state.user, ctx.params.id)
})

export default templateRouter