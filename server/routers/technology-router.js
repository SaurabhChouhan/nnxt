import Router from 'koa-router'
import {generateSchema, technologyAdditionStruct} from "../validation"
import {TechnologyModel} from "../models"

let technologyRouter = new Router({
    prefix: 'technologies'
})


technologyRouter.post("/", async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(technologyAdditionStruct)
    return await TechnologyModel.saveTechnology(ctx.request.body)
})

export default technologyRouter