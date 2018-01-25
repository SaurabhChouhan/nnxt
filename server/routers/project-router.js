import Router from 'koa-router'
import {ProjectModel} from "../models"

let projectRouter = new Router({
    prefix: "projects"
})

projectRouter.post("/", async ctx => {
    return await ProjectModel.saveProject(ctx.request.body)
})

export default projectRouter