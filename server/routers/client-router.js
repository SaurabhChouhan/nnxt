import Router from 'koa-router'
import {ClientModel} from "../models"

let clientRouter = new Router({
    prefix: "clients"
})

clientRouter.post('/', async ctx => {
    return await ClientModel.saveClient(ctx.request.body)
})


export default clientRouter