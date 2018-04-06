import * as AC from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_PERMISSIONS:
            return Object.assign({}, state, {all: action.permissions})
        case AC.ADD_PERMISSION:
            return Object.assign({}, state, {all: [...state.all, action.permission]})
        case AC.EDIT_PERMISSION:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.permission._id ? action.permission : item)})
        case AC.DELETE_PERMISSION:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.PermissionID)})
        default:
            return state
    }
}

export default permissionReducer