import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"
import projectRouter from "./project-router";

let moduleRouter = new Router({
    prefix: "modules"
})


moduleRouter.get("/", async ctx => {
    return await MDL.ModuleModel.getAllActive(ctx.state.user)
})


moduleRouter.post("/", async ctx => {

    return await MDL.ModuleModel.saveModule(ctx.request.body)
})

moduleRouter.delete("/:id", async ctx => {
    return await MDL.ModuleModel.Delete(ctx.params.id)
})
moduleRouter.put('/', async ctx => {
    return await MDL.ModuleModel.editModule(ctx.request.body)
})
export default moduleRouter