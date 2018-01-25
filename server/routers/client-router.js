import Router from 'koa-router'
import {ClientModel} from "../models"
import {clientAdditionStruct, validate, generateSchema} from "../validation"


let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    if(ctx.schemaRequested)
        return generateSchema(clientAdditionStruct)
    
    validate(ctx.request.body, clientAdditionStruct)
    return await ClientModel.saveClient(ctx.request.body)
})


export default clientRouter