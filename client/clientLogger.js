import {DEV_ENV, PROD_ENV} from "../server/serverconstants"
import {DEBUG_LEVEL, INFO_LEVEL, WARNING_LEVEL, ERROR_LEVEL} from "./clientconstants"

/*
LOG LEVEL
DEBUG - Would print all log statements (debug, info, warn, error)
INFO - Would ignore DEBUG logs
WARN - Would print log statements warn and error
ERROR - error log statements would be printed
 */


/*
 Setting trace number to any number would ensure that only those logs are printed that have that number as first parameter
 If trace number is set only those log statement would be printed that have that trace number (ir-respective of its type debug, info etc)
 Set trace number as undefined to print log statement based on its type and not by its number
*/

export const TABS_CHANGE_TAB = 'Tabs->changeTab():'
export const TABS_LIFE_CYCLE = 'Tabs->lc()'

export const USER_FORM_RENDER = 'UserForm->render():'

export const PERMISSION_FORM_RENDER = 'PermissionForm->render():'
export const PERMISSION_FORM_LIFECYCLE = 'PermissionForm->lc():'
export const PERMISSION_FORM_CONNECT = 'PermissionForm->connect():'
export const PERMISSION_LIST_RENDER = 'PermissionList->render():'
export const PERMISSION_LIST_LIFECYCLE = 'PermissionList->lc():'
export const PERMISSION_LIST_CONNECT = 'PermissionList->connect():'
export const PERMISSION_THUNK = 'Permission->thunk():'

export const USER_PROFILE_FORM_CONNECT = 'UserProfileForm->connect():'

let traceCodes = [TABS_LIFE_CYCLE, TABS_CHANGE_TAB]
let logLevel = DEBUG_LEVEL

if (process.env.NODE_ENV == PROD_ENV) {
    traceCodes = undefined
    logLevel = ERROR_LEVEL
}

const debug = (...params) => {
    if (logLevel === DEBUG_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("DEBUG:", ...params)
        else if (!traceCodes) {
            console.log("DEBUG:", ...params)
        }
    }
}

let info = (...params) => {
    if (logLevel === DEBUG_LEVEL || logLevel === INFO_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("INFO:", ...params)
        else if (!traceCodes) {
            console.log("INFO:", ...params)
        }
    }
}

let warn = (...params) => {
    if (logLevel === DEBUG_LEVEL || logLevel === INFO_LEVEL || logLevel === WARNING_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("WARN:", ...params)
        else if (!traceCodes) {
            console.log("WARN:", ...params)
        }
    }
}

let error = (...params) => {
    if (logLevel === DEBUG_LEVEL || logLevel === INFO_LEVEL || logLevel === WARNING_LEVEL || logLevel === ERROR_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("ERROR:", ...params)
        else if (!traceCodes) {
            console.log("ERROR:", ...params)
        }
    }
}

export {debug, warn, info, error}
