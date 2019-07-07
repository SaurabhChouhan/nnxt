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
    inReviewBillingPlans: [],
    billingClients: [],
    billingReleases: []
}

const billingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_BILLING_TASK_CRITERIA:
            return Object.assign({}, state, {
                billingTaskCriteria: action.criteria
            })
        case AC.ADD_INREVIEW_BILLING_PLANS:
            return Object.assign({}, state, {
                inReviewBillingPlans: action.releasePlans,
                inReviewBillingRelease: action.release
            })
        case AC.ADD_BILLING_CLIENTS: {
            return Object.assign({}, state, {
                billingClients: action.billingClients,
                billingReleases: [],
                inReviewBillingPlans: []
            })
        }
        case AC.ADD_BILLING_RELEASES:
            return Object.assign({}, state, {
                billingReleases: action.billingReleases.map(r => {
                    r.name = r.name + " (" + r.project.name + ")"
                    return r;
                }),
                inReviewBillingPlans: []
            })

        default:
            return state
    }
}

export default billingReducer