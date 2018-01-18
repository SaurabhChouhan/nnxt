import Router from 'koa-router'

import PermissionModel from '../models/permissionModel'

const permissionRouter = new Router({
    prefix: "permissions"
})

permissionRouter.get('/', async ctx => {
    let permission = await PermissionModel.getAll()
    return permission
})

permissionRouter.post('/', async ctx => {
    return await PermissionModel.savePermission(ctx.request.body)
})

permissionRouter.put('/', async ctx => {
    return await PermissionModel.editPermission(ctx.request.body)
})
permissionRouter.del('/:id', async ctx => {
    console.log("Inside delete of permission")
    return await PermissionModel.deletePermission(ctx.params.id)
})


export default permissionRouter