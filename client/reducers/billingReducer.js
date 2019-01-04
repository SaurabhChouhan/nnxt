import * as AC from "../actions/actionConsts"

let initialState = {
    selectedClient: {},
    clientReleases: [],
    billingTaskCriteria: {
        clientID: undefined,
        releaseID: undefined,
        fromDate: undefined,
        toDate: undefined
    }
}

const billingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASES_OF_CLIENT:
            return Object.assign({}, state, {
                selectedClient: action.client,
                clientReleases: action.releases
            })
        case AC.ADD_BILLING_TASK_CRITERIA:
            return Object.assign({}, state, {
                billingTaskCriteria: action.criteria
            })
        default:
            return state
    }
}

export default billingReducer