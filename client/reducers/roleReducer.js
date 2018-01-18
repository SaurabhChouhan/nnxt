import {ADD_ROLE, ADD_ROLES, EDIT_ROLE, DELETE_ROLE, ADMIN_EDITING_ROLE} from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {}
}

const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ROLES:
            return Object.assign({}, state, {all: action.roles})
        case ADD_ROLE:
            return Object.assign({}, state, {all: [...state.all, action.role]})
        case EDIT_ROLE:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.role._id ? action.role : item)})
        case DELETE_ROLE:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.role._id)})
        case ADMIN_EDITING_ROLE:
            // Admin has started editing this role (he can only enable/disable permissions), add appropriate needed for edit
            return Object.assign({}, state, {
                selected: Object.assign({}, action.role, {permissions: Array.isArray(action.role.permissions) ? action.role.permissions.filter(p => p.enabled) : []}),
                permissionOptions: action.role.permissions
            })

        default:
            return state
    }
}

export default roleReducer