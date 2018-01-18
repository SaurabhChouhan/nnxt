import {RoleModel, PermissionModel, UserModel} from "../models"
import {
    MANAGE_PERMISSIONS,
    MANAGE_ROLES,
    EDIT_PROFILE,
    CREATE_USER,
    LIST_USERS,
    EDIT_USER,
    DELETE_USER,
    EDIT_ROLE_PERMISSIONS
} from "../../client/clientconstants"

import {
    ROLE_SUPER_ADMIN,
    ROLE_ADMIN,
    ROLE_APP_USER,
    APP_USER_EMAIL,
    SUPER_ADMIN_EMAIL,
    ADMIN_EMAIL
} from "../serverconstants"

export const addInitialData = async () => {

    console.log("Adding initial data")

    if (!await PermissionModel.exists(MANAGE_PERMISSIONS)) {
        await PermissionModel.savePermission({
            name: MANAGE_PERMISSIONS
        })
    }

    if (!await PermissionModel.exists(MANAGE_ROLES)) {
        await PermissionModel.savePermission({
            name: MANAGE_ROLES
        })
    }

    if (!await PermissionModel.exists(LIST_USERS)) {
        await PermissionModel.savePermission({
            name: LIST_USERS
        })
    }

    if (!await PermissionModel.exists(EDIT_PROFILE)) {
        await PermissionModel.savePermission({
            name: EDIT_PROFILE
        })
    }

    if (!await PermissionModel.exists(EDIT_ROLE_PERMISSIONS)) {
        await PermissionModel.savePermission({
            name: EDIT_ROLE_PERMISSIONS
        })
    }

    /**
     * Super admin can manage users/permissions and roles
     */
    if (!await RoleModel.exists(ROLE_SUPER_ADMIN)) {

        let permissions = []
        let managePermissions = await PermissionModel.findOne({name: MANAGE_PERMISSIONS}).lean()
        if (managePermissions) {
            managePermissions.configurable = false
            managePermissions.enabled = true
            permissions.push(managePermissions)
        }
        let manageRoles = await PermissionModel.findOne({name: MANAGE_ROLES}).lean()
        if (manageRoles) {
            manageRoles.configurable = false
            manageRoles.enabled = true
            permissions.push(manageRoles)
        }
        let listUsers = await PermissionModel.findOne({name: LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = false
            listUsers.enabled = true
            permissions.push(listUsers)
        }
        await RoleModel.saveRole({
            name: ROLE_SUPER_ADMIN,
            permissions: permissions
        })
    }

    if (!await RoleModel.exists(ROLE_ADMIN)) {
        let permissions = []
        let listUsers = await PermissionModel.findOne({name: LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = true
            listUsers.enabled = true
            permissions.push(listUsers)
        }

        let editRolePermissions = await PermissionModel.findOne({name: EDIT_ROLE_PERMISSIONS}).lean()
        if (editRolePermissions) {
            editRolePermissions.configurable = true
            editRolePermissions.enabled = true
            permissions.push(editRolePermissions)
        }

        await RoleModel.saveRole({
            name: ROLE_ADMIN,
            permissions: permissions
        })
    }


    if (!await RoleModel.exists(ROLE_APP_USER)) {
        let permissions = []
        let editProfile = await PermissionModel.findOne({name: EDIT_PROFILE}).lean()
        if (editProfile) {
            editProfile.configurable = true
            editProfile.enabled = true
            permissions.push(editProfile)
        }
        await RoleModel.saveRole({
            name: ROLE_APP_USER,
            permissions: permissions
        })
    }

    if (!await UserModel.exists(ADMIN_EMAIL)) {
        let adminRole = await RoleModel.findOne({name: ROLE_ADMIN}).lean()

        // create user
        await UserModel.saveUser({
            email: ADMIN_EMAIL,
            firstName: "App",
            lastName: "Admin",
            roles: [adminRole],
            password: "admin"
        })
    }

    if (!await UserModel.exists(SUPER_ADMIN_EMAIL)) {

        let superAdminRole = await RoleModel.findOne({name: ROLE_SUPER_ADMIN}).lean()
        // create user
        await UserModel.saveUser({
            email: SUPER_ADMIN_EMAIL,
            firstName: "Super",
            lastName: "Admin",
            roles: [superAdminRole],
            password: "admin"
        })
    }

    if (!await UserModel.exists(APP_USER_EMAIL)) {
        let appUserRole = await RoleModel.findOne({name: ROLE_APP_USER}).lean()
        // create user
        await UserModel.saveUser({
            email: APP_USER_EMAIL,
            firstName: "App",
            lastName: "User",
            roles: [appUserRole],
            password: "appuser"
        })
    }

    console.log("Added initial data")

}