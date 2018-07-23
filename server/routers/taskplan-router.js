import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import * as U from '../utils'
import AppError from '../AppError'
import _ from 'lodash'

/***
 * Added prefix
 */

let taskPlanRouter = new Router({
    prefix: "task-plans"
})

/***
 * Get all task plannings by release plan Id
 ***/
taskPlanRouter.get("/release-plan/:releasePlanID", async ctx => {
    return await MDL.TaskPlanningModel.getTaskPlansOfReleasePlan(ctx.params.releasePlanID, ctx.state.user)
})

taskPlanRouter.get("/release/:releaseID", async ctx => {
    console.log("ctx.params.releaseID", ctx.params.releaseID)
    return await MDL.TaskPlanningModel.getAllTaskPlannings(ctx.params.releaseID, ctx.state.user)
})

/***
 * Get task planning schedule according to developer
 ***/
taskPlanRouter.get("/employee/:employeeID/fromDate/:fromDate/toDate/:toDate", async ctx => {
    return await MDL.TaskPlanningModel.getTaskPlanningDetailsByEmpIdAndFromDateToDate(ctx.params.employeeID, ctx.params.fromDate, ctx.params.toDate, ctx.state.user)

})

export default taskPlanRouter