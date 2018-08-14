import Router from 'koa-router'
import * as MDL from "../models"
import * as V from '../validation'

// Added prefix
let reportingRouter = new Router({
    prefix: "reporting"
})


/**
 * Get all the releases that user is associated with
 */
reportingRouter.get("/user-releases", async ctx => {
    return await MDL.ReleaseModel.getAllReleasesOfUser(ctx.state.user)
})

reportingRouter.get("/task-plans/release/:releaseID/date/:date/iteration-type/:iterationType/task-status/:reportedStatus", async ctx => {
    console.log("Inside get report tasks")
    return await MDL.TaskPlanningModel.getReportTasks(ctx.params.releaseID, ctx.params.date, ctx.params.iterationType, ctx.params.reportedStatus, ctx.state.user,)
})

reportingRouter.get("/task-plan/:taskPlanID", async ctx => {
    return await MDL.TaskPlanningModel.getTaskPlanDetails(ctx.params.taskPlanID, ctx.state.user)
})

//comment
reportingRouter.post("/comment", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.releaseTaskPlanningCommentStruct)
    return await MDL.TaskPlanningModel.addComment(ctx.request.body, ctx.state.user, ctx.schemaRequested)
})


reportingRouter.put("/task-plans/:taskID", async ctx => {
    if (ctx.schemaRequested)
        return V.generateSchema(V.releaseTaskReportStruct)
    return await MDL.TaskPlanningModel.addTaskReport(ctx.request.body, ctx.state.user)
})


reportingRouter.get("/:releaseID/details-for-reporting", async ctx => {
    return await MDL.ReleaseModel.getReleaseDetailsForReporting(ctx.params.releaseID, ctx.state.user)
})


reportingRouter.get("/release-plan-page/release/:releaseID", async ctx => {
    return await MDL.TaskPlanningModel.getReportsReleasePlanPage(ctx.params.releaseID, ctx.state.user)
})

reportingRouter.get("/report-task-detail-page/task-plan/:taskPlanID", async ctx => {
    return await MDL.TaskPlanningModel.getDataReportTaskDetailPage(ctx.params.taskPlanID, ctx.state.user)
})

export default reportingRouter