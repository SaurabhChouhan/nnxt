import Router from 'koa-router'
import * as MDL from "../models"
import { hasRole, isAuthenticated } from "../utils"
import * as SC from "../serverconstants"
import * as EC from '../errorcodes'
import AppError from '../AppError'
import * as V from '../validation'
import Excel from 'exceljs'

let estimationRouter = new Router({
    prefix: "/estimations"
})


const getLoggedInUsersRoleInEstimation = async (ctx, estimationID) => {
    let estimation = await MDL.EstimationModel.findById(estimationID)
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
    return await MDL.EstimationModel.getAllActive(ctx.params.projectID, ctx.params.status, ctx.state.user)
})

// noinspection Annotator
estimationRouter.get("/:estimationID", async ctx => {
    let estimation = await MDL.EstimationModel.getById(ctx.params.estimationID)
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
estimationRouter.get("/:estimationID/only", async ctx => {
    let estimation = await MDL.EstimationModel.findById(ctx.params.estimationID)

    estimation = estimation.toObject()
    if (estimation) {
        // check to see role of logged in user in this estimation
        estimation.tasks = undefined
        estimation.features = undefined
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
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR) {
        return await MDL.EstimationModel.deleteEstimationById(ctx.params.estimationID, ctx.state.user)

    } else {
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can delete estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }


})

// noinspection Annotator
estimationRouter.get("/feature/:featureID", async ctx => {
    let estimationFeature = await MDL.EstimationFeatureModel.getById(ctx.params.featureID)
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
    if (hasRole(ctx, SC.ROLE_NEGOTIATOR)) {
        return await MDL.EstimationModel.initiate(ctx.request.body, ctx.state.user)
    } else
        throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can initiate estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)


})


//update estimation by negotiator
estimationRouter.put('/update', async ctx => {
    // Return expected schema
    if (ctx.schemaRequested)
        return V.generateSchema(V.estimationInitiationStruct)

    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.request.body._id)
    if (role === SC.ROLE_NEGOTIATOR) {
        return await MDL.EstimationModel.updateEstimationByNegotiator(ctx.request.body, ctx.state.user)
    } else throw new AppError("Only users with role [" + SC.ROLE_NEGOTIATOR + "] can update initiate estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)


})


// noinspection Annotator
/**
 * Used for making estimation request by Negotiator
 */
estimationRouter.put('/:estimationID/request', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR)
        return await MDL.EstimationModel.request(ctx.params.estimationID, ctx.state.user)
    else throw new AppError("Cannot request estimation, not a negotiator of this estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

})

// noinspection Annotator
/**
 * User by Estimator to EstimationTaskDialog.js from Negotiator
 */
estimationRouter.put('/:estimationID/review-request', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_ESTIMATOR)
        return await MDL.EstimationModel.requestReview(ctx.params.estimationID, ctx.state.user)
    else throw new AppError("Cannot review-request estimation, not a estimator of this estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
})

// noinspection Annotator
estimationRouter.put('/:estimationID/change-request', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR)
        return await MDL.EstimationModel.requestChange(ctx.params.estimationID, ctx.state.user)
    else throw new AppError("Cannot change-request estimation, not a negotiator of this estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)

})

// noinspection Annotator
/**
 * Get all tasks of estimation by ID
 */
estimationRouter.get('/task/:estimationID', async ctx => {
    if (isAuthenticated(ctx)) {
        return await MDL.EstimationTaskModel.getAllTasksOfEstimation(ctx.params.estimationID, ctx.state.user)
    } else {
        throw new AppError("Not authenticated user.", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

// noinspection Annotator
/**
 * Add a new task to estimation
 */

estimationRouter.get('/export-estimation/:estimationID', async ctx => {
    let estimations = await MDL.EstimationModel.exportEstimation(ctx.params.estimationID, ctx.res);
    console.log("estimations is ", estimations.project)
    var workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();


    let excelFileName = estimations.project ? estimations.project.name : ""



    if (!excelFileName || excelFileName.trim().length == 0) {
        excelFileName = "Estimations"
    }

    /*else {
        excelFileName = excelFileName.replace(/ /g, '_')
    }*/

    var worksheet = workbook.addWorksheet(excelFileName)
    worksheet.getRow(1).values = ['Name', 'Description', 'EstimatedHours'];
    worksheet.columns = [
        { headers: "Name", key: 'name', width: 20 },
        { headers: "Description", key: 'description', width: 35 },
        { headers: "EstimatedHours", key: 'estimatedHours', width: 15 }
    ];
    estimations.features.map((feature) => {
        feature.tasks.map((task) => {
            if (typeof (task.estimator.estimatedHours) == "undefined") {
                worksheet.addRow({
                    description: task.negotiator.description,
                    name: task.negotiator.name,
                    estimatedHours: task.negotiator.estimatedHours
                })
            } else {
                worksheet.addRow({
                    description: task.estimator.description,
                    name: task.estimator.name,
                    estimatedHours: task.estimator.estimatedHours
                })
            }
        })
    })

    estimations.tasks.map((task) => {
        if (typeof (task.estimator.estimatedHours) == "undefined") {
            worksheet.addRow({
                description: task.negotiator.description,
                name: task.negotiator.name,
                estimatedHours: task.negotiator.estimatedHours
            })
        } else {
            worksheet.addRow({
                description: task.estimator.description,
                name: task.estimator.name,
                estimatedHours: task.estimator.estimatedHours
            })
        }
    })

    ctx.response.attachment(excelFileName + ".xlsx")
    ctx.status = 200
    await workbook.xlsx.write(ctx.res)
    ctx.res.end()
})

estimationRouter.post('/tasks', async ctx => {
    return await MDL.EstimationTaskModel.addTask(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

// noinspection Annotator
/**
 * Update a new task to estimation
 */
estimationRouter.put('/tasks', async ctx => {
    return await MDL.EstimationTaskModel.updateTask(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

/**
 * Delete task to estimation
 */
estimationRouter.del('/:estimationID/tasks/:taskID', async ctx => {
    return await MDL.EstimationTaskModel.deleteTask(ctx.params.taskID, ctx.params.estimationID, ctx.state.user)
})


// noinspection Annotator
/**
 * Add a new feature to estimation
 */
estimationRouter.post('/features', async ctx => {
    return await MDL.EstimationFeatureModel.addFeature(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})

// noinspection Annotator
/**
 * Update a new features to estimation
 */
estimationRouter.put('/features', async ctx => {
    return await MDL.EstimationFeatureModel.updateFeature(ctx.request.body, ctx.state.user, ctx.schemaRequested)

})


// noinspection Annotator
/**
 * Update a move to feature to estimation
 */
estimationRouter.put('/tasks/:taskID/features/:featureID', async ctx => {
    return await MDL.EstimationTaskModel.moveTaskToFeature(ctx.params.taskID, ctx.params.featureID, ctx.state.user)

})


// noinspection Annotator
/**
 * Update a move out of feature to estimation
 */
estimationRouter.put('/tasks/:taskID/move-out-of-feature', async ctx => {
    return await MDL.EstimationTaskModel.moveTaskOutOfFeature(ctx.params.taskID, ctx.state.user)

})


// noinspection Annotator
/**
 * Request removal of task to estimation
 */
estimationRouter.put('/tasks/:taskID/request-removal', async ctx => {
    return await MDL.EstimationTaskModel.requestRemovalTask(ctx.params.taskID, ctx.state.user)

})


// noinspection Annotator
/**
 * request Re-Open permission of task by estimator to estimation
 * or cancel this request
 */
estimationRouter.put('/tasks/:taskID/request-edit', async ctx => {
    return await MDL.EstimationTaskModel.requestReOpenPermissionOfTask(ctx.params.taskID, ctx.state.user)

})


// noinspection Annotator
/**
 * request ReOpen permission feature by estimator to estimation
 * or cancel this request
 */
estimationRouter.put('/features/:featureID/request-edit', async ctx => {
    return await MDL.EstimationFeatureModel.requestReOpenPermissionOfFeature(ctx.params.featureID, ctx.state.user)

})

// noinspection Annotator
/**
 * Grant ReOpen permission task by negotiator to estimation
 * or cancel this request
 */
estimationRouter.put('/tasks/:taskID/grant-edit', async ctx => {
    return await MDL.EstimationTaskModel.grantReOpenPermissionOfTask(ctx.params.taskID, ctx.state.user)

})


// noinspection Annotator
/**
 * Grant Edit/Update permission feature by negotiator to estimation
 * or cancel this request
 */
estimationRouter.put('/features/:featureID/grant-edit', async ctx => {
    return await MDL.EstimationFeatureModel.grantReOpenPermissionOfFeature(ctx.params.featureID, ctx.state.user)

})

// noinspection Annotator
estimationRouter.put('/tasks/:taskID/approve', async ctx => {
    return await MDL.EstimationTaskModel.approveTask(ctx.params.taskID, ctx.state.user)

})

// noinspection Annotator
estimationRouter.put('/features/:featureID/approve', async ctx => {
    return await MDL.EstimationFeatureModel.approveFeature(ctx.params.featureID, ctx.state.user)

})


// Used by negotiator to approve estimation
// noinspection Annotator

estimationRouter.put('/:estimationID/approve', async ctx => {
    return await MDL.EstimationModel.approveEstimation(ctx.params.estimationID, ctx.state.user)
})

estimationRouter.put('/:estimationID/hasError', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_ESTIMATOR) {
        return await MDL.EstimationModel.hasErrorEstimationByEstimator(ctx.params.estimationID, ctx.state.user)
    }
})


// Used by negotiator to check can approve feature

estimationRouter.put('/feature/:featureID/can-approve', async ctx => {
    return await MDL.EstimationFeatureModel.canApproveFeature(ctx.params.featureID, ctx.state.user)
})


// Used by negotiator to change can approve estimation
estimationRouter.put('/:estimationID/can-approve', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR) {
        return await MDL.EstimationModel.canApproveEstimationByNegotiator(ctx.params.estimationID, ctx.state.user)
    }
})


// Used by negotiator to change can not approve estimation

estimationRouter.put('/:estimationID/can-not-approve/:isGranted/is-granted', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR) {
        return await MDL.EstimationModel.canNotApproveEstimationByNegotiator(ctx.params.estimationID, ctx.params.isGranted, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can approve estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


// Used by negotiator to change can not approve feature

estimationRouter.put('/feature/:featureID/can-not-approve/:isGranted/is-granted', async ctx => {
    return await MDL.EstimationFeatureModel.canNotApproveFeature(ctx.params.featureID, ctx.params.isGranted, ctx.state.user)
})

// noinspection Annotator

estimationRouter.put('/create-release', async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.estimationCreateReleaseByNegotiatorStruct)
    return await MDL.EstimationModel.createReleaseFromEstimation(ctx.request.body, ctx.state.user)
})


// noinspection Annotator

estimationRouter.put('/add-to-release', async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.estimationAddToReleaseByNegotiatorStruct)
    return await MDL.EstimationModel.addEstimationToExistingRelease(ctx.request.body, ctx.state.user)
})

//soft delete feature in estimation

estimationRouter.del('/:estimationID/feature/:featureID', async ctx => {
    return await MDL.EstimationFeatureModel.deleteFeature(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)

})

// noinspection Annotator
/**
 * Add task from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/tasks/estimation/:estimationID/repository-task/:taskID', async ctx => {
    return await MDL.EstimationTaskModel.addTaskFromRepository(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)

})

// noinspection Annotator
/**
 * Add feature from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/features/estimation/:estimationID/repository-feature/:featureID', async ctx => {
    return await MDL.EstimationFeatureModel.addFeatureFromRepository(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)

})

/**
 * copy task from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/tasks/estimation/:estimationID/repository-task-copy/:taskID', async ctx => {
    return await MDL.EstimationTaskModel.copyTaskFromRepository(ctx.params.estimationID, ctx.params.taskID, ctx.state.user)

})

/**
 * Copy feature from repository by estimator/negotiator to estimation
 */
estimationRouter.post('/features/estimation/:estimationID/repository-feature-copy/:featureID', async ctx => {
    return await MDL.EstimationFeatureModel.copyFeatureFromRepository(ctx.params.estimationID, ctx.params.featureID, ctx.state.user)

})


estimationRouter.put('/features/:featureID/request-removal', async ctx => {
    return await MDL.EstimationFeatureModel.requestRemovalFeature(ctx.params.featureID, ctx.state.user)

})


estimationRouter.put('/feature/:featureID/reOpen', async ctx => {
    return await MDL.EstimationFeatureModel.reOpenFeature(ctx.params.featureID, ctx.state.user)

})


estimationRouter.put('/task/:taskID/reOpen', async ctx => {
    return await MDL.EstimationTaskModel.reOpenTask(ctx.params.taskID, ctx.state.user)
})


estimationRouter.put('/:estimationID/reopen', async ctx => {
    let role = await getLoggedInUsersRoleInEstimation(ctx, ctx.params.estimationID)
    if (role === SC.ROLE_NEGOTIATOR) {
        return await MDL.EstimationModel.reOpenEstimationByNegotiator(ctx.params.estimationID, ctx.state.user)
    } else {
        throw new AppError("Only user with role [" + SC.ROLE_NEGOTIATOR + "] can reopen estimation", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})


export default estimationRouter