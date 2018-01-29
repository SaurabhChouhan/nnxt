import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_CLIENTS:
            return Object.assign({}, state, {all: action.clients})

        case AC.ADD_CLIENT:
            return Object.assign({}, state, {all: [...state.all, action.client]})
        default:
            return state
    }
}

export default clientReducer