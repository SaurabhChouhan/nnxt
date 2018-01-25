import Router from 'koa-router'
import {EstimationModel} from "../models"

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.post('/initiate', async ctx => {
    return EstimationModel.initiate(ctx.request.body)
})

export default estimationRouter
