import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})


repositoryRouter.post("/search", async ctx => {
    let technologies =  ctx.request.body
    console.log("inside search",technologies)
    return await RepositoryModel.searchRepositories(ctx.request.body)
})

export default repositoryRouter