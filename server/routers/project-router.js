import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"

let projectRouter = new Router({
    prefix: "projects"
})

projectRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.projectAdditionStruct)

    V.validate(ctx.request.body, V.projectAdditionStruct)
    return await MDL.ProjectModel.saveProject(ctx.request.body)
})

projectRouter.get("/", async ctx => {
    return await MDL.ProjectModel.getAllActive(ctx.state.user)
})
projectRouter.delete("/:id", async ctx => {
    return await MDL.ProjectModel.softDelete(ctx.params.id)
})
projectRouter.put('/', async ctx => {
    return await MDL.ProjectModel.editProject(ctx.request.body)
})
export default projectRouter