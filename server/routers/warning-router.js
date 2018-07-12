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

warningRouter.get("/release/:releaseID/warningName/:warningType", async ctx => {
    return await MDL.WarningModel.getWarnings(ctx.params.releaseID,ctx.params.warningType, ctx.state.user)
})

export default warningRouter