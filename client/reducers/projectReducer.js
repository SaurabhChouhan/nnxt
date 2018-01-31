import {ADD_PROJECTS, ADD_PROJECT} from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

let projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PROJECTS:
            return Object.assign({}, state, {all: action.projects})
        case ADD_PROJECT:
            return Object.assign({}, state, {all: [...state.all, action.project]})
        default:
            return state
    }
}

export default projectReducer