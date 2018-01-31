import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})



repositoryRouter.get("/search", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(repositorySearchStruct)
    return "not implemented"
})



export default repositoryRouter