import {ADD_CLIENT} from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CLIENT:
            return Object.assign({}, state, {all: [...state.all, action.client]})
        default:
            return state
    }
}

export default clientReducer