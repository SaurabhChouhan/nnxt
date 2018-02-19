import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASES:
            return Object.assign({}, state, {all: action.releases})
        default:
            return state
    }
}

export default clientReducer