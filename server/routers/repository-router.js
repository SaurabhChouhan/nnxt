import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})


repositoryRouter.get("/search", async ctx => {
        console.log("ctx.params",ctx.query)
   return "ravi inside"
    // Return expected schema
    if (ctx.schemaRequested)
        return generateSchema(repositorySearchStruct)
    return await RepositoryModel.get()
})


export default repositoryRouter