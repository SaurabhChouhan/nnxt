import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})


repositoryRouter.get("/search", async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return generateSchema(repositorySearchStruct)


    return await RepositoryModel.get()
})


export default repositoryRouter