import * as AC from "../actions/actionConsts"

let initialState = {
    selectedClient: {},
    clientReleases: [],
    billingTaskCriteria: {
        clientID: undefined,
        releaseID: undefined,
        fromDate: undefined,
        toDate: undefined
    },
    billingReleasePlans: [],
    billingClients: [],
    billingReleases: []
}

const billingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_BILLING_TASK_CRITERIA:
            return Object.assign({}, state, {
                billingTaskCriteria: action.criteria
            })
        case AC.ADD_BILLING_RELEASE_PLANS:
            return Object.assign({}, state, {
                billingReleasePlans: action.releasePlans,
                billingRelease: action.release
            })
        case AC.ADD_BILLING_CLIENTS: {
            return Object.assign({}, state, {
                billingClients: action.billingClients,
                billingReleases: []
            })
        }
        case AC.ADD_BILLING_RELEASES:
            return Object.assign({}, state, {
                billingReleases: action.billingReleases.map(r => {
                    r.name = r.name + " (" + r.project.name + ")"
                    return r;
                })
            })

        default:
            return state
    }
}

export default billingReducer