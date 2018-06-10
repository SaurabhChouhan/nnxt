import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import _ from 'lodash'

/***
 * Added prefix
 */

let warningRouter = new Router({
    prefix: "warning"
})

/***
 * Get all warnings and by status filtering also
 ***/
warningRouter.get("/releases/:releaseID", async ctx => {
    return await MDL.WarningModel.getWarnings(ctx.params.releaseID, ctx.state.user)
})

export default warningRouter