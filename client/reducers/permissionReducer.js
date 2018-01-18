import {ADD_PERMISSIONS, ADD_PERMISSION, EDIT_PERMISSION, DELETE_PERMISSION} from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {}
}

const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PERMISSIONS:
            return Object.assign({}, state, {all: action.permissions})
        case ADD_PERMISSION:
            return Object.assign({}, state, {all: [...state.all, action.permission]})
        case EDIT_PERMISSION:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.permission._id ? action.permission : item)})
        case DELETE_PERMISSION:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.PermissionID)})
        default:
            return state
    }
}

export default permissionReducer