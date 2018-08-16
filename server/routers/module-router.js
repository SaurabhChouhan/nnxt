import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"


let moduleRouter = new Router({
    prefix: "modules"
})


moduleRouter.get("/", async ctx => {
    return await MDL.ModuleModel.getAllActive(ctx.state.user)
})


moduleRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.moduleAdditionStruct)

    V.validate(ctx.request.body, V.moduleAdditionStruct)

    return await MDL.ModuleModel.saveModule(ctx.request.body)
})

moduleRouter.delete("/:id", async ctx => {
    return await MDL.ModuleModel.Delete(ctx.params.id)
})
moduleRouter.put('/', async ctx => {
    return await MDL.ModuleModel.editModule(ctx.request.body)
})
export default moduleRouter