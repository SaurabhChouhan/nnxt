import Router from 'koa-router'
import * as MDL from "../models"
import * as EC from '../errorcodes'
import {isAdmin, isAuthenticated, isSuperAdmin} from "../utils"
import AppError from '../AppError'

const userRouter = new Router({
    prefix: "users"
})


userRouter.get('/', async ctx => {
    return await MDL.UserModel.getAllActive(ctx.state.user)
})

userRouter.get('/role-category', async ctx => {
    return await MDL.UserModel.getAllActiveWithRoleCategory(ctx.state.user)
})

userRouter.post('/', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await MDL.UserModel.saveUser(ctx.request.body)
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

})

userRouter.put('/', async ctx => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await MDL.UserModel.editUser(ctx.request.body)
    } else if (isAuthenticated(ctx)) {
        // Users other than admin/super admin would only be able to edit its own information check to see if edit user matches logged in user
        let userInput = ctx.request.body
        if (userInput._id == ctx.state.user._id) {
            return await MDL.UserModel.editUser(userInput)
        } else {
            throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
        }

    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

userRouter.del('/:id', async (ctx, next) => {
    if (isSuperAdmin(ctx) || isAdmin(ctx)) {
        return await MDL.UserModel.deleteUser(ctx.params.id)
    } else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
})

export default userRouter