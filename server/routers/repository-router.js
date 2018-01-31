import Router from 'koa-router'
import {generateSchema, repositorySearchStruct} from "../validation"
import {RepositoryModel} from "../models"

let repositoryRouter = new Router({
    prefix: 'repositories'
})



repositoryRouter.get("/search", async ctx => {
    return "not implemented"
})



export default repositoryRouter