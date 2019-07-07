import * as AC from "./actionConsts"

export const addClientReleases = (client, releases) => ({
    type: AC.ADD_RELEASES_OF_CLIENT,
    client,
    releases
})

export const addBillingTaskCriteria = (criteria) => ({
    type: AC.ADD_BILLING_TASK_CRITERIA,
    criteria
})

export const addBillingReleasePlans = (release, releasePlans) => ({
    type: AC.ADD_BILLING_RELEASE_PLANS,
    releasePlans,
    release
})

export const getReleasesOfClientFromServer = (clientID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/client/' + clientID, {
            method: 'get',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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