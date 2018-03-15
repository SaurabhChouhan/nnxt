import Router from 'koa-router'
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})

repositoryRouter.post("/search", async ctx => {
    return await RepositoryModel.searchRepositories(ctx.request.body)
})

repositoryRouter.get('/features/:featureID', async ctx => {
    return await RepositoryModel.getFeature(ctx.params.featureID)
})

export default repositoryRouter