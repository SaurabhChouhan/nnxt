import Router from 'koa-router'
import * as MDL from "../models"
import userRouter from "./user-router";

const notificationRouter = new Router({
    prefix: "/notifications"
})

export default notificationRouter