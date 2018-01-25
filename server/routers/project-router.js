import Router from 'koa-router'
import {ProjectModel} from "../models"
import {projectAdd, validate} from "./validation"


let projectRouter = new Router({
    prefix: "projects"
})

projectRouter.post("/", async ctx => {
    validate(ctx.request.body, projectAdd)
    return await ProjectModel.saveProject(ctx.request.body)
})

export default projectRouter