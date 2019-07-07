import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"

let clientRouter = new Router({
    prefix: "/clients"
})

clientRouter.post('/', async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.clientAdditionStruct)

    V.validate(ctx.request.body, V.clientAdditionStruct)
    return await MDL.ClientModel.saveClient(ctx.request.body, ctx.state.user)
})

clientRouter.get('/', async ctx => {
    return await MDL.ClientModel.getAllActive()
})

clientRouter.get('/active', async ctx => {
    return await MDL.ClientModel.getAllActiveClients()
})

clientRouter.delete("/:id", async ctx => {
    return await MDL.ClientModel.deleteClient(ctx.params.id)
})
clientRouter.put('/', async ctx => {
    return await MDL.ClientModel.editClient(ctx.request.body, ctx.state.user)
})


clientRouter.put('/:id', async ctx => {
    return await MDL.ClientModel.isActiveClient(ctx.params.id)
})

export default clientRouter