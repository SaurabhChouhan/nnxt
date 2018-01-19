import {
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN,
    ROLE_APP_USER
} from "./serverconstants"

export const isAuthenticated = (ctx) => {
    if (ctx.isAuthenticated())
        return true
    return false
}

export const isSuperAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == ROLE_SUPER_ADMIN) != -1)
            return true
    }
    return false
}

export const isAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == ROLE_ADMIN) != -1)
            return true
    }
    return false
}

export const isAppUser = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == ROLE_APP_USER) != -1)
            return true
    }
    return false
}

export const hasRole = (ctx, roleName) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == roleName) != -1)
            return true
    }
    return false
}