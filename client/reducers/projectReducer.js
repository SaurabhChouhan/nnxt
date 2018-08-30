import * as AC from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

let projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_PROJECTS:
            return Object.assign({}, state, {all: action.projects})
        case AC.ADD_PROJECT:
            return Object.assign({}, state, {all: [...state.all, action.project]})
        case AC.EDIT_PROJECT:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.project._id ? action.project : item)})
        case AC.DELETE_PROJECT:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.projectID)})
        case AC.UPDATE_PROJECT:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.project._id ? action.project : item)})

        default:
            return state
    }
}

export default projectReducer