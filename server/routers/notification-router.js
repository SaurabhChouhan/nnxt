import Router from 'koa-router'
import * as MDL from "../models";

const notificationRouter = new Router({
    prefix: "/notifications"
})


notificationRouter.get("/active", async ctx => {
    return await MDL.NotificationModel.getAllActiveNotifications(ctx.state.user)
})

notificationRouter.get('/notification-count-today', async (ctx) => {
    return await MDL.NotificationModel.getCountOfTodaysNotifications(ctx.state.user)
})


export default notificationRouter