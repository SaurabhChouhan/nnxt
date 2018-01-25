import Router from 'koa-router'
import {ClientModel} from "../models"
import {clientAdditionStruct, validate} from "../validation"


let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    return await ClientModel.saveClient(ctx.request.body)
})


export default clientRouter