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
    console.log("user has role ", user.roles)
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


export const convertUTCDateMomentToTZ = (utcMoment, timeZone) => {
    // format in utc
    console.log("utc moment found as ", utcMoment)

    let dateString = utcMoment.utc().format(SC.DATE_FORMAT)
    console.log("date string in utc is ", dateString)
    // now parse it using timezone
    return moment.tz(dateString, SC.DATE_FORMAT, timeZone).clone()

}


/**
 * Parses string in date/time format in UTC
 * @param dateTimeInStringInTZ
 * @param otherTZ
 * @returns {*}
 */
export const dateTimeInUTC = (dateTimeInString) => {
    return moment.tz(dateTimeInString, SC.DATE_TIME_FORMAT, SC.UTC_TIMEZONE)
}


/**
 * Return that moment in UTC when time was same as time is in other time zone (so if time in 5:00 AM in other time zone), returned
 * moment would be moment when it is 5:00 AM in UTC. As all dates are kept in UTC in database it is a good way to get data based on
 * current date/time in that particular time zone by first converting date using this method and then use that as a comparison with
 * database date field
 * @param otherTZ
 * @returns {*}
 */
export const getNowMomentInUTC = (otherTZ) => {
    return moment.tz(moment.tz(otherTZ).format(SC.DATE_TIME_FORMAT), SC.DATE_TIME_FORMAT, SC.UTC_TIMEZONE)
}

export const sameMomentInUTC = (d) => {
    return moment.utc().startOf('day').minute(d.getMinutes()).hour(d.getHours()).date(d.getDate()).month(d.getMonth()).year(d.getFullYear())
}


export const momentInUTCFromMoment = (m) => {
    return moment.utc().startOf('day').minute(m.minute()).hour(m.hour()).date(m.date()).month(m.month()).year(m.year())
}

export const momentInTZFromUTCMoment = (m, timeZone) => {
    let m1 = m.clone().utc()
    return moment.tz(timeZone).startOf('day').minute(m1.minute()).hour(m1.hour()).date(m1.date()).month(m1.month()).year(m1.year())
}

export const sameMomentInTimezone = (d, timeZone) => {
    console.log("d.getMinutes() ", d.getMinutes())
    console.log("d.getHours() ", d.getHours())
    return moment.tz(timeZone).startOf('day').minute(d.getMinutes()).hour(d.getHours()).date(d.getDate()).month(d.getMonth()).year(d.getFullYear())
}


export const momentFromDBDate = (d) => {
    return moment.tz(d, SC.UTC_TIMEZONE)
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

export const nowMomentInIndia = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.INDIAN_TIMEZONE)
    let nowMoment = moment.tz(nowString, SC.DATE_FORMAT, SC.INDIAN_TIMEZONE)
    if (nowMoment.isValid())
        return nowMoment
    return undefined
}

export const getPastMidNight = (timeZone) => {
    return moment().tz(timeZone).startOf('day')
}

export const getNextMidNight = (timeZone) => {
    return moment().tz(timeZone).startOf('day').add(1, 'day')
}

export const getNowMomentInUtc = () => {
    let now = new Date()
    let nowString = formatDateInTimezone(now, SC.DATE_FORMAT, SC.UTC_TIMEZONE)
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

export const getFullName = (user) => {
    return user ? user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.firstName ? user.firstName : user.lastName ? user.lastName : '' : ''
}

export const getCompleteName = (firstName, lastName) => {
    return firstName && lastName ? firstName + ' ' + lastName : firstName ? firstName : lastName ? lastName : ''
}

export const twoDecimalHours = (hours) => {
    return parseFloat(hours.toFixed(2))
}