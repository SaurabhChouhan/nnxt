import Router from 'koa-router'
import passport from 'koa-passport'
import * as MDL from "../models"
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'

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

publicRouter.post('/user_check_in_out', async (ctx, next) => {
    console.log("***Get user check in/out request*** \n ", ctx.request.body);
    return MDL.AttendanceModel.addUpdateAttendance(ctx.request.body);//ctx.body = {"msg":"this is completed"}
})

publicRouter.post('/create_dummy_attendance_entry', async (ctx, next) => {
    console.log("***Get user create_dummy_attendance_entry request*** \n ", ctx.request.body);
    return MDL.AttendanceModel.createAttendanceDummyEntry();//ctx.body = {"msg":"this is completed"}
})

publicRouter.get('/execute', async ctx => {
    console.log("execute query")
    return await MDL.YearlyHolidaysModel.getAllHolidayMoments('2018-06-02', '2018-08-01')
})

publicRouter.get('/forgot-password-request/:email', async (ctx) => {
    let  isForgotPassReqSuccess = await MDL.UserModel.forgotPasswordRequestM(ctx.params.email)
    return isForgotPassReqSuccess
})

publicRouter.put('/update-new-password', async (ctx) => {
    let  isUpdatedNewPassReqSuccess = await MDL.UserModel.updateNewPasswordWithOTP(ctx.params.body)
    return isUpdatedNewPassReqSuccess
})

export default publicRouter