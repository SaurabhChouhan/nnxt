import * as SC from './serverconstants'
import moment from 'moment-timezone'

export const isAuthenticated = (ctx) => {
    if (ctx.isAuthenticated())
        return true
    return false
}

export const isSuperAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == SC.ROLE_SUPER_ADMIN) != -1)
            return true
    }
    return false
}

export const isAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == SC.ROLE_ADMIN) != -1)
            return true
    }
    return false
}

export const isAppUser = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name == SC.ROLE_APP_USER) != -1)
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

export const userHasRole = (user, roleName) => {
    if (user && Array.isArray(user.roles) && user.roles.findIndex(r => r.name == roleName) != -1)
        return true
    return false
}

export const dateInUTC = (dateString) => {
    let momentDate = moment.tz(dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE)
    if (momentDate.isValid())
        return momentDate.toDate()
    return undefined
}

export const momentInUTC = (dateString) => {
    let momentDate = moment.tz(dateString, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE)
    if (momentDate.isValid())
        return momentDate
    return undefined
}

export const formatDateInUTC = (date) => {
    return moment(date).utc().format(SC.DATE_FORMAT)
}

export const formatDateInTimezone = (date, timeZone) => {
    return moment(date).tz(timeZone).format(SC.DATE_FORMAT)
}

export const formatDateTimeInTimezone = (date, timeZone) => {
    return moment(date).tz(timeZone).format(SC.DATE_TIME_FORMAT)
}



export const momentInTimeZone = (dateString, timeZone) => {
    let momentDate = moment.tz(dateString, SC.DATE_FORMAT, timeZone)
    if (momentDate.isValid())
        return momentDate
    return undefined
}