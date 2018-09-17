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

export const addNewEmailTemplatesType = (newEmailTemplateType) => ({
    type: AC.ADD_ALL_EMAIL_TEMPLATES_TYPES,
    newEmailTemplateType
})

export const addNewEmailTemplates = (newEmailTemplate) => ({
    type: AC.ADD_NEW_EMAIL_TEMPLATE,
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

export const editTemplate = (template) => ({
    type: AC.EDITED_EMAIL_TEMPLATE,
    template
})

export const saveEditTemplateInfo = (editTemplateInfo) => ({
    type: AC.EDIT_TEMPLATE_INFO,
    editTemplateInfo
})

export const deleteEmailTemplate = (templateID) => ({
    type: AC.DELETE_EMAIL_TEMPLATE,
    templateID
})


/* GET , ADD , UPDATE All email templates from server APIs  BLOCK */

export const getAllEmailTemplatesFromServer = (type) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template/type'+type,
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
                    dispatch(addNewEmailTemplates(json.data))
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
                    dispatch(editTemplate(json.data))
                }
                return json
            }
        )
    }
}

export const verifyTemplatesNameFromServer = (templateName) => {
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

export const deleteEmailTemplateFromServer = (templateID) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template/'+templateID,
            {
                method: "delete",
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
                    dispatch(deleteEmailTemplate(json.data))
                }
                return json
            }
        )
    }
}

export const approveTemplate = (template) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/approved-email-template/'+template._id,
            {
                method: "put",
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
                    dispatch(editTemplate(json.data))
                }
                return json
            }
        )
    }
}

/* GET , ADD , UPDATE All email templates from server APIs  BLOCK */



/* GET , ADD , UPDATE All email templates Types from server APIs  BLOCK */

export const getAllEmailTemplatesTypesFromServer = () => {
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
                    dispatch(addNewEmailTemplatesType(json.data))
                }
                return json
            }
        )
    }
}

export const verifyTemplatesTypeFromServer = (templateType) => {
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