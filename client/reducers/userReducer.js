import {ADD_LOGIN_USER, LOGIN_FAILED, ADD_USERS, ADD_USER, EDIT_USER, DELETE_USER} from "../actions/actionConsts"
import {ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_APP_USER} from "../../server/serverconstants";


let initialState = {
    loggedIn: undefined, // contains details of logged in user (if any) else undefined
    isAuthenticated: false,
    authenticationFailed: false,
    loginError: undefined,
    all: [],
    selected: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USERS:
            return Object.assign({}, state, {all: action.users})
        case ADD_USER:
            return Object.assign({}, state, {all: [...state.all, action.user]})
        case EDIT_USER:
            return Object.assign({}, state, {
                all: state.all.map(item => item._id == action.user._id ? action.user : item)
            })
        case DELETE_USER:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.userID)})
        case ADD_LOGIN_USER:
            if (action.user) {
                let isSuperAdmin = false
                let isAdmin = false
                let isAppUser = false
                if (action.user && Array.isArray(action.user.roles)) {
                    if (action.user.roles.findIndex(r => r.name === ROLE_SUPER_ADMIN) != -1)
                        isSuperAdmin = true
                    if (action.user.roles.findIndex(r => r.name === ROLE_ADMIN) != -1)
                        isAdmin = true
                    if (action.user.roles.findIndex(r => r.name === ROLE_APP_USER) != -1)
                        isAppUser = true
                }

                return Object.assign({}, state, {
                    loggedIn: Object.assign({}, action.user, {isSuperAdmin, isAdmin, isAppUser}),
                    isAuthenticated: true,
                    loginError: undefined
                })
            } else
                return state
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                isAuthenticated: false,
                loginError: action.error
            })

        default:
            return state
    }
}

export default userReducer