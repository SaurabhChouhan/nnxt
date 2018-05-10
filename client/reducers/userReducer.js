import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants";


let initialState = {
    loggedIn: undefined, // contains details of logged in user (if any) else undefined
    isAuthenticated: false,
    authenticationFailed: false,
    loginError: undefined,
    all: [],
    userWithRoleCategory: {
        managers: [],
        leaders: [],
        team: []
    },
    selected: {},
    allDevelopers: []
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_USERS:
            return Object.assign({}, state, {all: action.users})


        case AC.ADD_USERS_WITH_ROLE_CATEGORY:
            return Object.assign({}, state, {
                userWithRoleCategory: {
                    managers: action.users.managers,
                    leaders: action.users.leaders,
                    team: action.users.team
                }
            })


        case AC.ADD_USERS_WITH_ROLE_DEVELOPER:
            return Object.assign({}, state, {
                userWithRoleCategory: Object.assign({}, state.userWithRoleCategory, {
                    team: action.developers
                })
            })

        case AC.ADD_DEVELOPERS_TO_STATE:
            return Object.assign({}, state, {
                allDevelopers: action.developers
            })


        case AC.ADD_USER:
            return Object.assign({}, state, {all: [...state.all, action.user]})


        case AC.EDIT_USER:
            return Object.assign({}, state, {
                all: state.all.map(item => item._id == action.user._id ? action.user : item)
            })


        case AC.DELETE_USER:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.userID)})


        case AC.ADD_LOGIN_USER:
            if (action.user) {
                let isSuperAdmin = false
                let isAdmin = false
                let isAppUser = false
                if (action.user && Array.isArray(action.user.roles)) {
                    if (action.user.roles.findIndex(r => r.name === SC.ROLE_SUPER_ADMIN) != -1)
                        isSuperAdmin = true
                    if (action.user.roles.findIndex(r => r.name === SC.ROLE_ADMIN) != -1)
                        isAdmin = true
                    if (action.user.roles.findIndex(r => r.name === SC.ROLE_APP_USER) != -1)
                        isAppUser = true
                }

                return Object.assign({}, state, {
                    loggedIn: Object.assign({}, action.user, {isSuperAdmin, isAdmin, isAppUser}),
                    isAuthenticated: true,
                    loginError: undefined
                })
            } else
                return state


        case AC.LOGIN_FAILED:
            return Object.assign({}, state, {
                isAuthenticated: false,
                loginError: action.error
            })


        case AC.UPDATE_USER_PROFILE_STATE:
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