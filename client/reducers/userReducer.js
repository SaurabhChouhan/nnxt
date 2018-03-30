import {
    ADD_LOGIN_USER,
    ADD_USER,
    ADD_USERS,
    ADD_USERS_WITH_ROLE_CATEGORY,
    DELETE_USER,
    EDIT_USER,
    LOGIN_FAILED,
    UPDATE_USER_PROFILE_STATE
} from "../actions/actionConsts"
import {ROLE_ADMIN, ROLE_APP_USER, ROLE_SUPER_ADMIN} from "../../server/serverconstants";


let initialState = {
    loggedIn: undefined, // contains details of logged in user (if any) else undefined
    isAuthenticated: false,
    authenticationFailed: false,
    loginError: undefined,
    all: [],
    userWithRoleCategory: {},
    selected: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USERS:
            return Object.assign({}, state, {all: action.users})
        case ADD_USERS_WITH_ROLE_CATEGORY:
            return Object.assign({}, state, {userWithRoleCategory: action.users})
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
        case UPDATE_USER_PROFILE_STATE:
            return Object.assign({}, state, {
                loggedIn: (true) ?
                    Object.assign({}, {
                        firstName: action.user.firstName,
                        lastName: action.user.lastName,
                        phone: action.user.phone,
                        email: action.user.email,
                        address: action.user.address,
                        dob: action.user.dob,
                        dateJoined: action.user.dateJoined,
                        designation: action.user.designation,
                        employeeCode: action.user.employeeCode,
                        roles: action.user.roles,
                        permissions: state.loggedIn.permissions,
                        roleNames: state.loggedIn.roleNames
                    }) : state.user.loggedIn


            })
        default:
            return state
    }
}

export default userReducer