import Router from 'koa-router'
import * as MDL from "../models"

let developmentTypeRouter = new Router({
    prefix: '/developmentTypes'
})

developmentTypeRouter.get("/", async ctx => {
    return await MDL.DevelopmentModel.getAllActive()
})

export default developmentTypeRouter