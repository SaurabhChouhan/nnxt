import {initialize} from 'redux-form'
import * as AC from "./actionConsts"

export const addAllEmailTemplates = (allEmailTemplates) => ({
    type: AC.ADD_ALL_EMAIL_TEMPLATES,
    allEmailTemplates
})

export const addAllEmailTemplatesTypes = (allEmailTemplatesTypes) => ({
    type: AC.ADD_ALL_EMAIL_TEMPLATES_TYPES,
    allEmailTemplatesTypes
})

export const addEmailTemplate = (newEmailTemplate) => ({
    type: AC.ADD_EMAIL_TEMPLATE,
    newEmailTemplate
})

export const addIsEmailTemplateTypeExist = (isEmailTemplateTypeExist) => ({
    type: AC.ADD_IS_EMAIL_TEMPLATE_TYPE_EXIST,
    isEmailTemplateTypeExist
})

export const addIsEmailTemplateNameExist = (isEmailTemplateNameExist) => ({
    type: AC.ADD_IS_EMAIL_TEMPLATE_NAME_EXIST,
    isEmailTemplateNameExist
})

/* GET , ADD , UPDATE All email templates from server APIs  BLOCK */

export const getAllEmailTemplatesFromServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllEmailTemplates(json.data))
                }
                return json
            }
        )
    }
}


export const addEmailTemplateOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllEmailTemplates(json.data))
                }
                return json
            }
        )
    }
}

export const updateEmailTemplateOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllEmailTemplates(json.data))
                }
                return json
            }
        )
    }
}

export const isEmailTemplateNameIsExistOnServer = (templateName) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/verify-email-template-name/'+templateName,
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addIsEmailTemplateNameExist(json.data))
                }
                return json
            }
        )
    }
}

/* GET , ADD , UPDATE All email templates from server APIs  BLOCK */



/* GET , ADD , UPDATE All email templates Types from server APIs  BLOCK */

export const getAllEmailTemplatesTypesFromServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template-types',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllEmailTemplatesTypes(json.data))
                }
                return json
            }
        )
    }
}

export const addEmailTypesOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template-type',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllEmailTemplatesTypes(json.data))
                }
                return json
            }
        )
    }
}

export const isEmailTemplateTypeIsExistOnServer = (templateType) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/verify-email-template-type/'+templateType,
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addIsEmailTemplateTypeExist(json.data))
                }
                return json
            }
        )
    }
}


/* GET , ADD , UPDATE All email templates Types from server APIs  BLOCK */