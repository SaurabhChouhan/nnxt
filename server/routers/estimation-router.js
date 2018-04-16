import Router from 'koa-router'
import {EstimationFeatureModel, EstimationModel, EstimationTaskModel} from "../models"
import {hasRole, isAuthenticated} from "../utils"
import * as SC from "../serverconstants"
import * as EC from '../errorcodes'
import AppError from '../AppError'
import * as V from '../validation'

let estimationRouter = new Router({
    prefix: "estimations"
})


const getLoggedInUsersRoleInEstimation = async (ctx, estimationID) => {
    let estimation = await EstimationModel.getById(estimationID)
    if (estimation) {
        // check to see role of logged in user in this estimation
        if (estimation.estimator._id == ctx.state.user._id)
            return SC.ROLE_ESTIMATOR
        else if (estimation.negotiator._id == ctx.state.user._id)
            return SC.ROLE_NEGOTIATOR
    }
    return undefined
}

// noinspection Annotator
estimationRouter.get("/project/:projectID/status/:status", async ctx => {
    return await EstimationModel.getAllActive(ctx.params.projectID, ctx.params.status, ctx.state.user)
})

// noinspection Annotator
estimationRouter.get("/:estimationID", async ctx => {
    let estimation = await EstimationModel.getById(ctx.params.estimationID)
    if (estimation) {
        // check to see role of logged in user in this estimation

        if (estimation.estimator._id == ctx.state.user._id)
            estimation.loggedInUserRole = SC.ROLE_ESTIMATOR
        else if (estimation.negotiator._id == ctx.state.user._id)
            estimation.loggedInUserRole = SC.ROLE_NEGOTIATOR
        else {
            throw new AppError("Not allowed to see estimation details", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
        }

    }
    return estimation
})

// noinspection Annotator
// Delete Estimation

estimationRouter.del("/:estimationID/delete", async ctx => {
    console.log("estimation delete of ", ctx.params.estimationID)
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        let estimation = await EstimationModel.deleteEstimationById(ctx.params.estimationID, ctx.state.user)
        console.log("estimation delete", estimation)
        return estimation
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can delete estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }


})

// noinspection Annotator
estimationRouter.get("/feature/:featureID", async ctx => {
    let estimationFeature = await EstimationFeatureModel.getById(ctx.params.featureID)
    if (!estimationFeature) {
        throw new AppError("Not allowed to see estimation details", EC.NOT_FOUND, EC.HTTP_FORBIDDEN)
    }
    estimationFeature = estimationFeature.toObject()
    estimationFeature.tasks = []
    return estimationFeature
})


// noinspection Annotator
/**
 * Initiate estimation by Negotiator
 */

estimationRouter.post('/initiate', async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return V.generateSchema(V.estimationUpdationStruct)

    if (!hasRole(ctx, SC.ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can initiate estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    return await EstimationModel.initiate(ctx.request.body, ctx.state.user)
})


//update estimation by negotiator
estimationRouter.put('/update', async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return V.generateSchema(V.estimationInitiationStruct)

    if (!hasRole(ctx, SC.ROLE_NEGOTIATOR))
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can update initiate estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

    return await EstimationModel.updateEstimationByNegotiator(ctx.request.body, ctx.state.user)
})


// noinspection Annotator
/**
 * Used for making estimation request by Negotiator
 */
estimationRouter.put('/:estimationID/request', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    console.log("Role of user in this estimation is ", role)
    if (role != SC.ROLE_NEGOTIATOR)
        throw new AppError("Cannot request estimation, not a negotiator of this estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    return EstimationModel.request(ctx.params.estimationID, ctx.state.user)
})

// noinspection Annotator
/**
 * User by Estimator to EstimationTaskDialog.js from Negotiator
 */
estimationRouter.put('/:estimationID/review-request', async ctx => {
    return await EstimationModel.requestReview(ctx.params.estimationID, ctx.state.user)
})

// noinspection Annotator
estimationRouter.put('/:estimationID/change-request', async ctx => {
    return await EstimationModel.requestChange(ctx.params.estimationID, ctx.state.user)
})

// noinspection Annotator
/**
 * Add a new task to estimation
 */
estimationRouter.post('/tasks', async ctx => {
    return await EstimationTaskModel.addTask(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

// noinspection Annotator
/**
 * Update a new task to estimation
 */
estimationRouter.put('/tasks', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationEstimatorUpdateTaskStruct)
        return await EstimationTaskModel.updateTaskByEstimator(ctx.request.body, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationNegotiatorUpdateTaskStruct)
        return await EstimationTaskModel.updateTaskByNegotiator(ctx.request.body, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can update task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Get all tasks of estimation by ID
 */
estimationRouter.get('/task/:estimationID', async ctx => {
    if (isAuthenticated(ctx)) {
        return await EstimationTaskModel.getAllTaskOfEstimation(ctx.params.estimationID)
    } else {
        throw new AppError("Not authenticated user.", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Add a new feature to estimation
 */
estimationRouter.post('/features', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationEstimatorAddFeatureStruct)
        return await EstimationFeatureModel.addFeatureByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationNegotiatorAddFeatureStruct)
        return await EstimationFeatureModel.addFeatureByNegotiator(ctx.request.body, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add features into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Update a new features to estimation
 */
estimationRouter.put('/features', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationEstimatorUpdateFeatureStruct)
        return await EstimationFeatureModel.updateFeatureByEstimator(ctx.request.body, ctx.state.user)

    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationNegotiatorUpdateFeatureStruct)
        return await EstimationFeatureModel.updateFeatureByNegotiator(ctx.request.body, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can update features into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Update a move to feature to estimation
 */
estimationRouter.put('/tasks/:taskID/features/:featureID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.moveTaskToFeatureByEstimator(ctx.params.taskID, ctx.params.featureID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.moveTaskToFeatureByNegotiator(ctx.params.taskID, ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can move task to features into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// noinspection Annotator
/**
 * Update a move out of feature to estimation
 */
estimationRouter.put('/tasks/:taskID/move-out-of-feature', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.moveTaskOutOfFeatureByEstimator(ctx.params.taskID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.moveTaskOutOfFeatureByNegotiator(ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can move task out of features into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// noinspection Annotator
/**
 * Request removal of task to estimation
 */
estimationRouter.put('/tasks/:taskID/request-removal', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.requestRemovalTaskByEstimator(ctx.params.taskID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can request removal task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// noinspection Annotator
/**
 * request Edit/Update permission task by estimator to estimation
 * or cancel this request
 */
estimationRouter.put('/tasks/:taskID/request-edit', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.requestEditPermissionOfTaskByEstimator(ctx.params.taskID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can request edit permission task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// noinspection Annotator
/**
 * request Edit/Update permission feature by estimator to estimation
 * or cancel this request
 */
estimationRouter.put('/features/:featureID/request-edit', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationFeatureModel.requestEditPermissionOfFeatureByEstimator(ctx.params.featureID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can request edit permission task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

/**
 * Delete task to estimation
 */
estimationRouter.del('/:estimationID/tasks/:taskID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.deleteTaskByEstimator(ctx.params, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.deleteTaskByNegotiator(ctx.params, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add features into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Grant Edit/Update permission task by negotiator to estimation
 * or cancel this request
 */
estimationRouter.put('/tasks/:taskID/grant-edit', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.grantEditPermissionOfTaskByNegotiator(ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can grant edit permission of task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// noinspection Annotator
/**
 * Grant Edit/Update permission feature by negotiator to estimation
 * or cancel this request
 */
estimationRouter.put('/features/:featureID/grant-edit', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.grantEditPermissionOfFeatureByNegotiator(ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can grant edit permission of task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
estimationRouter.put('/tasks/:taskID/approve', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.approveTaskByNegotiator(ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve task", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
estimationRouter.put('/features/:featureID/approve', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.approveFeatureByNegotiator(ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// Used by negotiator to approve estimation
// noinspection Annotator
estimationRouter.put('/:estimationID/approve', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationModel.approveEstimationByNegotiator(ctx.params.estimationID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// Used by negotiator to check can approve estimation
estimationRouter.put('/:estimationID/can-approve', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationModel.canApproveEstimationByNegotiator(ctx.params.estimationID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// Used by negotiator to check can approve feature
estimationRouter.put('/feature/:featureID/can-approve', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.canApproveFeatureByNegotiator(ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// Used by negotiator to change can not approve estimation
estimationRouter.put('/:estimationID/can-not-approve/:isGranted/is-granted', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationModel.canNotApproveEstimationByNegotiator(ctx.params.estimationID, ctx.params.isGranted, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// Used by negotiator to change can not approve feature
estimationRouter.put('/feature/:featureID/can-not-approve/:isGranted/is-granted', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.canNotApproveFeatureByNegotiator(ctx.params.featureID, ctx.params.isGranted, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve feature", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
estimationRouter.put('/project-awarded', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        if (ctx.schemaRequested)
            return V.generateSchema(V.estimationProjectAwardByNegotiatorStruct)
        return await EstimationModel.projectAwardByNegotiator(ctx.request.body, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can project award of this estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


//soft delete feature by estimation
estimationRouter.del('/:estimationID/feature/:featureID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationFeatureModel.deleteFeatureByEstimator(ctx.params, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.deleteFeatureByNegotiator(ctx.params, ctx.state.user)

    } else throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + SC.ROLE_NEGOTIATOR + "] can delete features from estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
})

// noinspection Annotator
/**
 * Add task from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/tasks/estimation/:estimationID/repository-task/:taskID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.addTaskFromRepositoryByEstimator(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.addTaskFromRepositoryByNegotiator(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add task from repository into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Add feature from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/features/estimation/:estimationID/repository-feature/:featureID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationFeatureModel.addFeatureFromRepositoryByEstimator(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.addFeatureFromRepositoryByNegotiator(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can add feature from repo into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

/**
 * copy task from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/tasks/estimation/:estimationID/repository-task-copy/:taskID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationTaskModel.copyTaskFromRepositoryByEstimator(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.copyTaskFromRepositoryByNegotiator(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can copy task from repository into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

/**
 * Copy feature from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/features/estimation/:estimationID/repository-feature-copy/:featureID', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationFeatureModel.copyFeatureFromRepositoryByEstimator(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.copyFeatureFromRepositoryByNegotiator(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can copy feature from repo into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


estimationRouter.put('/features/:featureID/request-removal', async ctx => {
    if (hasRole(ctx, SC.ROLE_ESTIMATOR)) {
        return await EstimationFeatureModel.requestRemovalFeatureByEstimator(ctx.params.featureID, ctx.state.user)
    } else if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return "not implemented"
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_ESTIMATOR + "," + SC.ROLE_NEGOTIATOR + "] can request removal task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


estimationRouter.put('/feature/:featureID/reOpen', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationFeatureModel.reOpenFeatureByNegotiator(ctx.params.featureID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can directly reOpen Feature into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


estimationRouter.put('/task/:taskID/reOpen', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationTaskModel.reOpenTaskByNegotiator(ctx.params.taskID, ctx.state.user)
    } else {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can directly reOpen task into estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


estimationRouter.put('/:estimationID/reopen', async ctx => {
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await EstimationModel.reOpenEstimationByNegotiator(ctx.params.estimationID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can reopen estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


export default estimationRouter