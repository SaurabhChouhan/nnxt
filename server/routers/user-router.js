import Router from 'koa-router'
import {UserModel} from "../models"
import * as ErrorCodes from '../errorcodes'
import {isSuperAdmin, isAdmin} from "../utils"
import AppError from '../AppError'
import {ROLE_SUPER_ADMIN} from "../serverconstants"
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"

const userRouter = new Router()


userRouter.get('/users', async ctx => {
    // admin would see all users that have role other than super admin
    if (isAdmin(ctx)) {
        return await UserModel.find({"roles.name": {$ne: ROLE_SUPER_ADMIN}}).exec()
    } else if (isSuperAdmin(ctx)) {
        return await UserModel.find()
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

userRouter.post('/users', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.saveUser(ctx.request.body)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }

})

userRouter.put('/users', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.editUser(ctx.request.body)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

userRouter.del('/users/:id', async (ctx, next) => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await UserModel.deleteUser(ctx.params.id)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

export default userRouter