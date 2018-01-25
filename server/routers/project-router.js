import Router from 'koa-router'
import {ProjectModel} from "../models"
import {validate, projectAdditionStruct, generateSchema} from "../validation"

let projectRouter = new Router({
    prefix: "projects"
})

projectRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(projectAdditionStruct)

    validate(ctx.request.body, projectAdditionStruct)
    return await ProjectModel.saveProject(ctx.request.body)
})

export default projectRouter