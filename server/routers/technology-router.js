import Router from 'koa-router'
import * as V from "../validation"
import * as MDL from "../models"

let technologyRouter = new Router({
    prefix: 'technologies'
})


technologyRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.technologyAdditionStruct)
    return await MDL.TechnologyModel.saveTechnology(ctx.request.body)
})

technologyRouter.get("/", async ctx => {
    return await MDL.TechnologyModel.getAllActive()
})

technologyRouter.delete("/:id", async ctx => {
    return await MDL.TechnologyModel.delete(ctx.params.id)
})

export default technologyRouter