import {ADD_TECHNOLOGY, ADD_TECHNOLOGIES} from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

let technologyReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TECHNOLOGIES:
            return Object.assign({}, state, {all: action.technologies})
        case ADD_TECHNOLOGY:
            return Object.assign({}, state, {all: [...state.all, action.technology]})
        default:
            return state
    }
}

export default technologyReducer