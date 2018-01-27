import Router from 'koa-router'
import {EstimationModel, EstimationTaskModel} from "../models"
import {hasRole} from "../utils"
import {ROLE_ESTIMATOR, ROLE_NEGOTIATOR} from "../serverconstants";
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import AppError from '../AppError'
import {toObject} from 'tcomb-doc'
import {estimationInitiationStruct, estimationEstimatorAddTaskStruct, validate, generateSchema} from "../validation"

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.get("/", async ctx => {
    return await EstimationModel.getAllActive()
})

estimationRouter.post('/initiate', async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return generateSchema(estimationInitiationStruct)

    if (!hasRole(ctx, ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [" + ROLE_NEGOTIATOR + "] can initiate estimation", ACCESS_DENIED, HTTP_FORBIDDEN)

    return EstimationModel.initiate(ctx.request.body, ctx.state.user)
})

estimationRouter.put('/request/:estimationID', async ctx => {
    if (!hasRole(ctx, ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [" + ROLE_NEGOTIATOR + "] can request estimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    return EstimationModel.request(ctx.params.estimationID, ctx.state.user)
})


/**
 * Add a new task to estimation
 */
estimationRouter.post('/task', async ctx => {
    if (hasRole(ctx, ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return generateSchema(estimationEstimatorAddTaskStruct)
        return await EstimationTaskModel.addTaskByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can initiate estimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})


export default estimationRouter