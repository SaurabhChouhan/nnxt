import Router from 'koa-router'
import * as MDL from "../models"

// Added prefix
let reportingRouter = new Router({
    prefix: "reportings"
})


reportingRouter.get("/", async ctx => {
    return await MDL.ReleaseModel.getAllReportingProjects(ctx.state.user)
})

//report/task-plans/release/' + releaseID + '/date/' + planDate + '/task-status/' + taskStatus
reportingRouter.get("/task-plans/release/:releaseID/date/:planDate/task-status/:taskStatus", async ctx => {
    return await MDL.ReleaseModel.getTaskPlanedForEmployee(ctx.params, ctx.state.user)
})

//report/taskID/' + taskID + '/releaseID/' + releaseID + 'detail
reportingRouter.get("/:taskID/release/:releaseID/report-detail", async ctx => {
    console.log("ctx.params.taskID", ctx.params.taskID)
    console.log("ctx.params.releaseID", ctx.params.releaseID)
    return await MDL.ReleaseModel.getTaskAndProjectDetails(ctx.params.taskID, ctx.params.releaseID, ctx.state.user)
})

export default reportingRouter