import Router from 'koa-router'
import * as V from "../validation"
import {TechnologyModel} from "../models"

let technologyRouter = new Router({
    prefix: 'technologies'
})


technologyRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.technologyAdditionStruct)
    return await TechnologyModel.saveTechnology(ctx.request.body)
})

technologyRouter.get("/", async ctx => {
    return await TechnologyModel.getAllActive()
})

technologyRouter.delete("/:id", async ctx => {
    return await TechnologyModel.delete(ctx.params.id)
})

export default technologyRouter