import Router from 'koa-router'
import {RoleModel} from '../models'
import {isSuperAdmin, isAdmin} from "../utils"
import {ROLE_ADMIN, ROLE_SUPER_ADMIN} from "../serverconstants"
import {ACCESS_DENIED, HTTP_FORBIDDEN} from "../errorcodes"
import AppError from '../AppError'
import _ from 'lodash'

const roleRouter = new Router({
    prefix: "roles"
})

/**
 * Only Admin and super admin cen get roles. Admin would not see super admin role
 */
roleRouter.get('/', async ctx => {
    if (isAdmin(ctx)) {
        return await RoleModel.getWithConfigurablePerms()
    } else if (isSuperAdmin(ctx)) {
        return await RoleModel.getAll()
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

// only super admin can add/update or remove roles
roleRouter.post('/', async ctx => {
    if (isSuperAdmin(ctx)) {
        return await RoleModel.saveRole(ctx.request.body)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }

})

roleRouter.put('/', async ctx => {
    if (isSuperAdmin(ctx)) {
        return await RoleModel.editRole(ctx.request.body)
    } else if (isAdmin(ctx)) {
        /**
         * As this is admin editing role, he should have added removed permissions from this role, we would have to set enabled flag based on this
         * All permissions that come through would be considered as enabled while all other would be considered as disabled
         */

        let roleInput = ctx.request.body
        let role = await RoleModel.findById(roleInput._id).lean()
        console.log("found role as ", role.permissions)

        if (!_.isEmpty(role.permissions)) {
            role.permissions = role.permissions.map(p => {
                if (p.configurable) {
                    // As this permission was configurable if it is present in input consider it as enabled else as disabled
                    if (!_.isEmpty(roleInput.permissions) && roleInput.permissions.findIndex(p1 => p1.name == p.name) != -1) {
                        p.enabled = true
                    } else {
                        p.enabled = false
                    }
                    return p
                } else {
                    // as this permission was not configurable it would remain as is
                    return p
                }
            })
        }

        role = await RoleModel.editRole(role)
        role.permissions = role.permissions.filter(p => p.configurable)
        return role
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

roleRouter.del('/:id', async ctx => {
    if (isSuperAdmin(ctx)) {
        return await RoleModel.deleteRole(ctx.params.id)
    } else {
        throw new AppError("Access Denied", ACCESS_DENIED, HTTP_FORBIDDEN)
    }
})

export default roleRouter