import * as AC from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

let moduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_MODULES:
            return Object.assign({}, state, {all: action.modules})
        case AC.ADD_MODULE:
            return Object.assign({}, state, {all: [...state.all, action.module]})
        case AC.EDIT_MODULE:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.module._id ? action.module : item)})
        case AC.DELETE_MODULE:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.moduleID)})
        default:
            return state
    }
}

export default moduleReducer