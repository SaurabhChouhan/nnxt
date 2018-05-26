import Router from 'koa-router'
import * as MDL from "../models"
import * as V from '../validation'

// Added prefix
let reportingRouter = new Router({
    prefix: "reportings"
})


/**
 * Get all the releases that user is associated with
 */
reportingRouter.get("/user-releases", async ctx => {
    return await MDL.ReleaseModel.getAllReleasesOfUser(ctx.state.user)
})

//report/task-plans/release/' + releaseID + '/date/' + planDate + '/task-status/' + taskStatus
reportingRouter.get("/task-plans/release/:releaseID/date/:date/task-status/:reportedStatus", async ctx => {
    return await MDL.TaskPlanningModel.getReportTasks(ctx.params.releaseID, ctx.state.user, ctx.params.date, ctx.params.reportedStatus)
    //return await MDL.ReleaseModel.getTaskPlanedForEmployee(ctx.params, ctx.state.user)
})

//report/taskID/' + taskID + '/releaseID/' + releaseID + 'detail
reportingRouter.get("/:taskID/release/:releaseID/report-detail", async ctx => {
    return await MDL.ReleaseModel.getTaskAndProjectDetails(ctx.params.taskID, ctx.params.releaseID, ctx.state.user)
})

//comment
reportingRouter.post("/comment", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.releaseTaskPlanningCommentStruct)
    return await MDL.TaskPlanningModel.addComment(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})

export default reportingRouter