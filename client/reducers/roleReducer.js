import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {}
}

const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ROLES:
            return Object.assign({}, state, {all: action.roles})
        case AC.ADD_ROLE:
            return Object.assign({}, state, {all: [...state.all, action.role]})
        case AC.EDIT_ROLE:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.role._id ? action.role : item)})
        case AC.DELETE_ROLE:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.role._id)})
        case AC.ADMIN_EDITING_ROLE:
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