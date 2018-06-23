import Router from 'koa-router'
import passport from 'koa-passport'
import * as MDL from "../models"
import AppError from '../AppError'
import * as EC from '../errorcodes'


/**
 * All authentication releated APIs would go here
 * @type {Router}
 */


const publicRouter = new Router()

publicRouter.post('/login', async (ctx, next) => {
    await passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log("***info***", info, "*****status*****", status)
            throw new AppError(info.message, EC.LOGIN_FAILED, 401)
        }

        // remove password information from user
        user.password = undefined
        ctx.loggedInUser = user;


    })(ctx, next)

    await ctx.login(ctx.loggedInUser)
    return ctx.loggedInUser
})

publicRouter.get('/execute', async ctx => {
    console.log("execute query")
    return await MDL.YearlyHolidaysModel.getAllHolidayMoments('2018-06-02', '2018-08-01')
})

export default publicRouter