import Router from 'koa-router'
import * as MDL from "../models"

let repositoryRouter = new Router({
    prefix: '/repositories'
})

repositoryRouter.post("/search", async ctx => {
    return await MDL.RepositoryModel.searchRepositories(ctx.request.body)
})

repositoryRouter.get('/features/:featureID', async ctx => {
    return await MDL.RepositoryModel.getFeature(ctx.params.featureID)
})

export default repositoryRouter