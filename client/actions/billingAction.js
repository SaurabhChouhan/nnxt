import * as AC from "./actionConsts"
import {showComponent} from './'
import { formValueSelector, initialize } from 'redux-form'
import { BILLING_TASK_DESCRIPTION_DIALOG } from '../components/componentConsts'


export const addBillingTaskCriteria = (criteria) => ({
    type: AC.ADD_BILLING_TASK_CRITERIA,
    criteria
})

export const addInReviewBillingPlans = (release, releasePlans) => ({
    type: AC.ADD_INREVIEW_BILLING_PLANS,
    releasePlans,
    release
})

export const addBillingClients = (billingClients) => ({
    type: AC.ADD_BILLING_CLIENTS,
    billingClients
})

export const addBillingReleases = (billingReleases) => ({
    type: AC.ADD_BILLING_RELEASES,
    billingReleases
})

export const clearInReviewBillingPlans = () => ({
    type: AC.CLEAR_INREVIEW_BILLING
})

export const getBillingClientsFromServer = (criteria) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/billing-clients', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        }).then(
            response => response.json()
        )
    }
}

export const getBillingProjectsFromServer = (criteria) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/billing-projects', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        }).then(
            response => response.json()
        )
    }
}

export const getBillingReleasesOfClientFromServer = (criteria) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/billing-releases', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        }).then(
            response => response.json()
        )
    }
}


export const getInReviewBillingPlansFromServer = (criteria) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/inreview-billing-plans', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        }).then(
            response => response.json()
        )
    }
}

export const fetchCurrentDescriptionFromState = (data) => {
    let selector = formValueSelector('billing-task-form-' + data._id)
    return (dispatch, getState) => {
        let state = getState()
        let description = selector(state, 'description')
        console.log("found description from state ", description)
        data.description = description
        dispatch(initialize('billing-task-description', data))
        dispatch(showComponent(BILLING_TASK_DESCRIPTION_DIALOG))
    }
}

export const addBillingTaskDescriptionOnServer = (billingData) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/add-billing-task-description', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(billingData)
        }).then(
            response => response.json()
        )
    }
}

export const updateBillingTaskOnServer = (billingData) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/billing-task', {
            method: 'put',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(billingData)
        }).then(
            response => response.json()
        )
    }
}