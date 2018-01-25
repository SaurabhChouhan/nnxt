import Router from 'koa-router'
import {EstimationModel} from "../models"
import {hasRole} from "../utils"
import {ROLE_NEGOTIATOR} from "../serverconstants";
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import AppError from '../AppError'
import {toObject} from 'tcomb-doc'
import {estimationInitiationStruct, validate, generateSchema} from "../validation"

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.post('/initiate', async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return generateSchema(estimationInitiationStruct)

    if (!hasRole(ctx, ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [Negotiator] can initiate estimation", ACCESS_DENIED, HTTP_FORBIDDEN)

    validate(ctx.request.body, estimationInitiationStruct)
    return EstimationModel.initiate(ctx.request.body, ctx.state.user)
})

export default estimationRouter
