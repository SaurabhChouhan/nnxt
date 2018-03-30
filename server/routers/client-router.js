import Router from 'koa-router'
import {ClientModel} from "../models"
import {clientAdditionStruct, validate, generateSchema} from "../validation"
import projectRouter from "./project-router";


let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    if (ctx.schemaRequested)
        return generateSchema(clientAdditionStruct)

    validate(ctx.request.body, clientAdditionStruct)
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