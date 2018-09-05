import {initialize} from 'redux-form'
import * as AC from "./actionConsts"

export const addAllEmailTemplates = (allEmailTemplates) => ({
    type: AC.ADD_ALL_EMAIL_TEMPLATES,
    allEmailTemplates
})

export const addEmailTemplate = (newEmailTemplate) => ({
    type: AC.ADD_EMAIL_TEMPLATE,
    newEmailTemplate
})

export const addAllEmailSubjects = (allEmailTemplateSubjects) => ({
    type: AC.ADD_ALL_EMAIL_SUBJECTS,
    allEmailTemplateSubjects
})

export const addEmailSubject = (emailSubject) => ({
    type: AC.ADD_EMAIL_SUBJECT,
    emailSubject
})


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
                    dispatch(addEmailTemplate(json.data))
                }
                return json
            }
        )
    }
}

export const getAllEmailTemplatesFromServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template-types',
            {
                method: "get",
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
                    dispatch(addAllEmailSubjects(json.data))
                }
                return json
            }
        )
    }
}

export const addEmailSubjectOnServer = (formInput) => {
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
                    dispatch(addEmailSubject(json.data))
                }
                return json
            }
        )
    }
}

export const getAllEmailSubjectsFromServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/dashboard/email-template',
            {
                method: "get",
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
