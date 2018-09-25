import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"
import {CLIENT_ARIPRA} from "../serverconstants";

let projectRouter = new Router({
    prefix: "/projects"
})

projectRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.projectAdditionStruct)

    V.validate(ctx.request.body, V.projectAdditionStruct)
    return await MDL.ProjectModel.saveProject(ctx.request.body)
})

projectRouter.post("/search", async ctx => {
    return await MDL.ProjectModel.search(ctx.request.body, ctx.state.user)
})

projectRouter.get("/", async ctx => {
    return await MDL.ProjectModel.getAllActive(ctx.state.user)
})

/**
 * Returns all the projects of releases user is involved with (He is Developer/Leader/Manager or Non project developer
 */
projectRouter.get("/user-releases", async ctx => {
    return await MDL.ProjectModel.getProjectsOfReleasesInvolved(ctx.state.user)
})

/**
 * Returns all the projects of estimations user is involved with (Negotiator or Estimator)
 */
projectRouter.get("/user-estimations", async ctx => {
    return await MDL.ProjectModel.getProjectsOfEstimationsInvolved(ctx.state.user)
})

projectRouter.delete("/:id", async ctx => {
    return await MDL.ProjectModel.softDelete(ctx.params.id)
})
projectRouter.put('/', async ctx => {
    return await MDL.ProjectModel.editProject(ctx.request.body)
})

projectRouter.put('/:id', async ctx => {
    return await MDL.ProjectModel.isActiveProject(ctx.params.id)
})

export default projectRouter