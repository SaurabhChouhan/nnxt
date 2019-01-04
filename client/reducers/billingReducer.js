import * as AC from "../actions/actionConsts"

let initialState = {
    selectedClient: {},
    clientReleases: []
}

const billingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASES_OF_CLIENT:
            return Object.assign({}, state, {
                selectedClient: action.client,
                clientReleases: action.releases
            })
        default:
            return state
    }
}

export default billingReducer