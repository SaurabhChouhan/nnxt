import Router from 'koa-router'
import {ClientModel} from "../models"
import {clientAdd, validate} from "./validation"


let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    validate(ctx.request.body, clientAdd)
    return await ClientModel.saveClient(ctx.request.body)
})


export default clientRouter