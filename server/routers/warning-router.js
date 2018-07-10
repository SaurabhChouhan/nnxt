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
warningRouter.get("/release/:releaseID", async ctx => {
    return await MDL.WarningModel.getWarnings(ctx.params.releaseID, ctx.state.user)
})

warningRouter.get("/:warningType/status/:status/flag/:empflag/release-plans", async ctx => {

    return await MDL.WarningModel.geWarningsBywarningType(ctx.params, ctx.state.user)

})

export default warningRouter