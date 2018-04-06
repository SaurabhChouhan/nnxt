import Router from 'koa-router'
import {ClientModel} from "../models"
import * as V from "../validation"


let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.clientAdditionStruct)

    V.validate(ctx.request.body, V.clientAdditionStruct)
    return await ClientModel.saveClient(ctx.request.body)
})

clientRouter.get('/', async ctx => {
    return await ClientModel.getAllActive()
})

clientRouter.delete("/:id", async ctx => {
    return await ClientModel.deleteClient(ctx.params.id)
})
clientRouter.put('/', async ctx => {
    return await ClientModel.editClient(ctx.request.body)
})


export default clientRouter