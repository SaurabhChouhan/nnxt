import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})

repositoryRouter.get("/search", async ctx => {
    let technologies =  ctx.query
    return await RepositoryModel.searchRepositories(technologies)
})

export default repositoryRouter