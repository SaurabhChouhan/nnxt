import Router from 'koa-router'
import {ProjectModel} from "../models"
import {validate, projectAdditionStruct, generateSchema} from "../validation"
import permissionRouter from "./permission-router";
import PermissionModel from "../models/permissionModel";

let projectRouter = new Router({
    prefix: "projects"
})

projectRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(projectAdditionStruct)

    validate(ctx.request.body, projectAdditionStruct)
    return await ProjectModel.saveProject(ctx.request.body)
})

projectRouter.get("/", async ctx => {
    return await ProjectModel.getAllActive(ctx.state.user)
})
projectRouter.delete("/:id", async ctx => {
    return await ProjectModel.softDelete(ctx.params.id)
})
projectRouter.put('/', async ctx => {
    console.log("You aere in project routerr edit project", ctx.request.body)
    return await ProjectModel.editProject(ctx.request.body)
})
export default projectRouter