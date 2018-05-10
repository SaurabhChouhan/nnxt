import Router from 'koa-router'
import * as  MDL from '../models'

const permissionRouter = new Router({
    prefix: "permissions"
})

permissionRouter.get('/', async ctx => {
    let permission = await MDL.PermissionModel.getAll()
    return permission
})

permissionRouter.post('/', async ctx => {
    return await MDL.PermissionModel.savePermission(ctx.request.body)
})

permissionRouter.put('/', async ctx => {
    return await MDL.PermissionModel.editPermission(ctx.request.body)
})
permissionRouter.del('/:id', async ctx => {
    return await MDL.PermissionModel.deletePermission(ctx.params.id)
})


export default permissionRouter