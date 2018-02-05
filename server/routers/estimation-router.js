import Router from 'koa-router'
import {EstimationModel, EstimationTaskModel,EstimationFeatureModel} from "../models"
import {hasRole,isAuthenticated} from "../utils"
import {ROLE_ESTIMATOR, ROLE_NEGOTIATOR} from "../serverconstants";
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import AppError from '../AppError'
import {toObject} from 'tcomb-doc'
import * as SC from '../serverconstants'
import {
    estimationInitiationStruct,
    estimationEstimatorAddTaskStruct,
    estimationNegotiatorAddTaskStruct,
    estimationEstimatorAddFeatureStruct,
    validate,
    generateSchema
} from "../validation"

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.get("/", async ctx => {
    return await EstimationModel.getAllActive(ctx.state.user)
})

estimationRouter.get("/:estimationID", async ctx => {
    let estimation = await EstimationModel.getById(ctx.params.estimationID)
    if(estimation){
        // check to see role of logged in user in this estimation

        if(estimation.estimator._id == ctx.state.user._id)
            estimation.loggedInUserRole = SC.ROLE_ESTIMATOR
        else if(estimation.negotiator._id == ctx.state.user._id)
            estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
        else {
            throw new AppError("Not allowed to see estimation details", ACCESS_DENIED, HTTP_FORBIDDEN)
        }

    }
    return estimation
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
estimationRouter.post('/tasks', async ctx => {
    if (hasRole(ctx, ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return generateSchema(estimationEstimatorAddTaskStruct)
        return await EstimationTaskModel.addTaskByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, ROLE_NEGOTIATOR)) {
        if(ctx.schemaRequested)
            return generateSchema(estimationNegotiatorAddTaskStruct)
        return await EstimationTaskModel.addTaskByNegotiator(ctx.request.body, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can add task into estimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

/**
 * Get all tasks of estimation by ID
 */
estimationRouter.get('/task/:estimationID', async ctx => {
    if(isAuthenticated(ctx)){
        return await EstimationTaskModel.getAllTaskOfEstimation(ctx.params.estimationID)
    } else {
        throw new AppError("Not authenticated user.", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

/**
 * Add a new features to estimation
 */
estimationRouter.post('/features', async ctx => {
    if (hasRole(ctx, ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return generateSchema(estimationEstimatorAddFeatureStruct)
        return await EstimationFeatureModel.addFeatureByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can add features into estimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

/**
 * Update a new features to estimation
 */
estimationRouter.put('/features', async ctx => {
    if (hasRole(ctx, ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return generateSchema(estimationEstimatorUpdateFeatureStruct)
        return await EstimationFeatureModel.updateFeatureByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can add features into stimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

/**
 * Update a move to feature to estimation
 */
estimationRouter.put('/move-to-feature', async ctx => {
    if (hasRole(ctx, ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return generateSchema(estimationEstimatorMoveToFeatureStruct)
        return await EstimationTaskModel.moveTaskToFeature(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + ROLE_ESTIMATOR + "," + ROLE_NEGOTIATOR + "] can add features into stimation", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})


export default estimationRouter