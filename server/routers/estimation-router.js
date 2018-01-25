import Router from 'koa-router'
import {EstimationModel} from "../models"
import {hasRole} from "../utils"
import {ROLE_NEGOTIATOR} from "../serverconstants";
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import AppError from '../AppError'
import {toObject} from 'tcomb-doc'
import {estimationInitiationStruct} from "../validation/estimation-validation"

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.post('/initiate', async ctx => {
    //return toObject(estimationInitiationStruct)
    if (!hasRole(ctx, ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [Negotiator] can initiate estimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    return EstimationModel.initiate(ctx.request.body, ctx.state.user)
})

export default estimationRouter
