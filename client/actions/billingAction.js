import * as AC from "./actionConsts"


export const addBillingTaskCriteria = (criteria) => ({
    type: AC.ADD_BILLING_TASK_CRITERIA,
    criteria
})

export const addBillingReleasePlans = (release, releasePlans) => ({
    type: AC.ADD_BILLING_RELEASE_PLANS,
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

export const getBillingReleasePlansFromServer = (criteria) => {
    return (dispatch, getState) => {
        return fetch('/api/billings/search-billing-tasks', {
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