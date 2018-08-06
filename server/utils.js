import * as SC from './serverconstants'
import moment from 'moment-timezone'
import _ from 'lodash'
//import logger from './logger'

export const isAuthenticated = (ctx) => {
    if (ctx.isAuthenticated())
        return true
    return false
}

export const isSuperAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name === SC.ROLE_SUPER_ADMIN) !== -1)
            return true
    }
    return false
}

export const isHighestManagementRole = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name === SC.ROLE_TOP_MANAGEMENT) !== -1)
            return true
    }
    return false
}

export const isAdmin = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name === SC.ROLE_ADMIN) !== -1)
            return true
    }
    return false
}

export const isAppUser = (ctx) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name === SC.ROLE_APP_USER) !== -1)
            return true
    }
    return false
}

export const hasRole = (ctx, roleName) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.user && Array.isArray(ctx.state.user.roles) && ctx.state.user.roles.findIndex(r => r.name === roleName) !== -1)
            return true
    }
    return false
}

export const userHasRole = (user, roleName) => {
    if (user && Array.isArray(user.roles) && user.roles.length && user.roles.findIndex(r => r.name === roleName) !== -1)
        return true
    return false
}


export const userHasOnlyRole = (user, roleName) => {
    if (user && Array.isArray(user.roles) && user.roles.length && user.roles.length === 1 && user.roles.findIndex(r => r.name === roleName) !== -1)
        return true
    return false
}

export const dateInUTC = (dateString) => {
    let momentDate = moment.tz(dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).startOf('day')
    if (momentDate.isValid())
        return momentDate.toDate()
    return undefined
}

export const momentInUTC = (dateString) => {
    let momentDate = moment.tz(dateString, SC.DATE_FORMAT, SC.UTC_TIMEZONE).startOf('day')
    if (momentDate.isValid())
        return momentDate
    return undefined
}

export const sameMomentInUTC = (d) => {
    return moment.utc().startOf('day').minute(d.getMinutes()).hour(d.getHours()).date(d.getDate()).month(d.getMonth()).year(d.getFullYear())
}

export const momentFromDateInTimeZone = (d, timeZone) => {
    return moment.tz(timeZone).startOf('day').minute(d.getMinutes()).hour(d.getHours()).date(d.getDate()).month(d.getMonth()).year(d.getFullYear())
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

export const nowMomentInTimeZone = (timeZone) => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, timeZone)
    let nowMoment = moment.tz(nowString, SC.DATE_FORMAT, timeZone)
    if (nowMoment.isValid())
        return nowMoment
    return undefined
}

export const nowMomentInIndia = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.INDIAN_TIMEZONE)
    let nowMoment = moment.tz(nowString, SC.DATE_FORMAT, SC.INDIAN_TIMEZONE)
    if (nowMoment.isValid())
        return nowMoment
    return undefined
}

export const getNowMomentInUtc = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.UTC_TIMEZONE)
    let nowMoment = momentInUTC(nowString)

    if (nowMoment.isValid())
        return nowMoment
    return undefined
}

export const getNowStringInIndia = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.INDIAN_TIMEZONE)
    return nowString
}

export const getNowStringInUtc = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.UTC_TIMEZONE)
    return nowString
}

export const getCurrentYear = () => {
    let now = new Date()
    return now.getFullYear()
}

/**
 * Returns true if if array in second argument include value/values in first argument
 * @param values - primitive or array
 * @param arr - Array
 * @returns {boolean}
 */
export const includeAny = (values, arr) => {
    if (!Array.isArray(arr))
        return false
    if (Array.isArray(values)) {
        let result = false;
        values.forEach(v => {
                if (_.includes(arr, v))
                    result = true
            }
        )
        return result;
    } else if (values) {
        if (_.includes(arr, values))
            return true;
    }
    return false
}