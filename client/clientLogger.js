import * as SC from "../server/serverconstants"
import * as CC from "./clientconstants"

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
export const TABS_LIFE_CYCLE = 'Tabs->lc():'
export const TABS_RENDER = 'Tabs->render():'

export const USER_FORM_RENDER = 'UserForm->render():'

export const PERMISSION_FORM_RENDER = 'PermissionForm->render():'
export const PERMISSION_FORM_LIFECYCLE = 'PermissionForm->lc():'
export const PERMISSION_FORM_CONNECT = 'PermissionForm->connect():'
export const PERMISSION_LIST_RENDER = 'PermissionList->render():'
export const PERMISSION_LIST_LIFECYCLE = 'PermissionList->lc():'
export const PERMISSION_LIST_CONNECT = 'PermissionList->connect():'
export const PERMISSION_THUNK = 'Permission->thunk():'

export const CLIENT_FORM_RENDER = 'ClientForm->render():'
export const CLIENT_FORM_CONNECT = 'ClientForm->connect():'

export const CONTENT_MAIN_RENDER = 'ContentMain->render():'
export const CONTENT_MAIN_LIFECYCLE = 'ContentMain->lc():'

export const USER_PROFILE_FORM_CONNECT = 'UserProfileForm->connect():'
export const ESTIMATION_INITIATE_FORM_SUBMIT = 'EstimationInitiateForm->submit():'
export const ESTIMATION_INITIATE_FORM_RENDER = 'EstimationInitiateForm->render():'

export const ESTIMATION_TASK_FORM_SUBMIT = 'EstimationTaskForm->submit():'
export const ESTIMATION_TASK_FORM_RENDER = 'EstimationTaskForm->render():'
export const ESTIMATION_FEATURE_FORM_RENDER = 'EstimationFeatureForm->render():'
export const ESTIMATION_FEATURE_FORM_SUBMIT = 'EstimationFeatureForm->submit():'
export const ESTIMATION_SUGGEST_FEATURE_FORM_SUBMIT = 'EstimationSuggestFeatureForm->submit():'
export const ESTIMATION_PROJECT_AWARD_FORM_RENDER = 'EstimationProjectAwardForm->render():'
export const ESTIMATION_PROJECT_AWARD_FORM_SUBMIT = 'EstimationProjectAwardForm->submit():'

export const ESTIMATION_LIST_CONNECT = "EstimationList->connect():"

export const TECHNOLOGY_FORM_RENDER = 'TechnologyForm->render():'
export const TECHNOLOGY_FORM_CONNECT = 'TechnologyForm->connect():'
export const TECHNOLOGY_FORM_LIFECYCLE = 'TechnologyForm->lc():'

export const PROJECT_FORM_RENDER = 'ProjectForm->render():'
export const PROJECT_FORM_CONNECT = 'ProjectForm->connect():'

export const ESTIMATION_DETAIL_RENDER = 'EstimationDetail->render():'
export const ESTIMATION_TASK_RENDER = 'EstimationTask->render():'
export const ESTIMATION_TASK_LIFECYCLE = 'EstimationTask->lc():'
export const ESTIMATION_TASK_BUTTONS = 'EstimationTask->buttons:'
export const ESTIMATION_FEATURE_RENDER = 'EstimationFeature->render():'
export const ESTIMATION_FEATURE_BUTTONS = 'EstimationFeature->buttons:'
export const ESTIMATION_FEATURE_DETAIL_RENDER = 'EstimationFeatureDetail->render():'

export const ATTENDENCE_SETTING_FORM_RENDER = 'AttendenceForm->render():'
export const ATTENDENCE_SETTING_FORM_CONNECT = 'AttendenceForm->connect():'

let traceCodes = [ESTIMATION_TASK_RENDER, ESTIMATION_FEATURE_RENDER, ESTIMATION_FEATURE_DETAIL_RENDER]
//let traceCodes = undefined
let logLevel = CC.DEBUG_LEVEL

if (process.env.NODE_ENV == SC.PROD_ENV) {
    traceCodes = undefined
    logLevel = CC.ERROR_LEVEL
}

const debug = (...params) => {
    if (logLevel === CC.DEBUG_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("DEBUG:", ...params)
        else if (!traceCodes) {
            console.log("DEBUG:", ...params)
        }
    }
}

let info = (...params) => {
    if (logLevel === CC.DEBUG_LEVEL || logLevel === CC.INFO_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("INFO:", ...params)
        else if (!traceCodes) {
            console.log("INFO:", ...params)
        }
    }
}

let warn = (...params) => {
    if (logLevel === CC.DEBUG_LEVEL || logLevel === CC.INFO_LEVEL || logLevel === CC.WARNING_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("WARN:", ...params)
        else if (!traceCodes) {
            console.log("WARN:", ...params)
        }
    }
}

let error = (...params) => {
    if (logLevel === CC.DEBUG_LEVEL || logLevel === CC.INFO_LEVEL || logLevel === CC.WARNING_LEVEL || logLevel === CC.ERROR_LEVEL) {
        if (traceCodes && traceCodes.indexOf(params[0]) != -1)
            console.log("ERROR:", ...params)
        else if (!traceCodes) {
            console.log("ERROR:", ...params)
        }
    }
}

export {debug, warn, info, error}
