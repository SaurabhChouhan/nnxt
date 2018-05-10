import {initialize} from 'redux-form'
import * as AC from "./actionConsts"


export const addLoginUser = (user) => ({
    type: AC.ADD_LOGIN_USER,
    user: user
})

export const loginFailed = (error) => ({
    type: AC.LOGIN_FAILED,
    error: error
})

export const addAllUsers = (users) => ({
    type: AC.ADD_USERS,
    users: users
})

export const addUsersWithRoleCategory = (users) => ({
    type: AC.ADD_USERS_WITH_ROLE_CATEGORY,
    users: users
})

export const addUsersWithRoleDeveloper = (developers) => ({
    type: AC.ADD_USERS_WITH_ROLE_DEVELOPER,
    developers: developers
})

export const addDevelopersToState = (developers) => ({
    type: AC.ADD_DEVELOPERS_TO_STATE,
    developers: developers
})

export const addUser = (user) => ({
    type: AC.ADD_USER,
    user: user
})

export const editUser = (user) => ({
    type: AC.EDIT_USER,
    user: user
})

export const deleteUser = (userID) => ({
    type: AC.DELETE_USER,
    userID: userID
})
export const updateUserProfileState = (user) => ({
    type: AC.UPDATE_USER_PROFILE_STATE,
    user: user
})

export const addUserOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/users',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addUser(json.data))
                }
                return json
            }
        )
    }
}


export const getAllUsersFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/users',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addAllUsers(json.data))
                }
                return json
            }
        )
    }
}


export const getUsersWithRoleCategoryFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/users/role-category',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addUsersWithRoleCategory(json.data))
                }
                return json
            }
        )
    }
}


export const getUsersWithRoleDeveloperFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/users/role-developer',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addUsersWithRoleDeveloper(json.data))
                }
                return json
            }
        )
    }
}


export const getAllDeveloperFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/users/role-developer',
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addDevelopersToState(json.data))
                }
                return json
            }
        )
    }
}


//update user
export const editUserOnServer = (user) => {
    return function (dispatch, getState) {
        return fetch('/api/users',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(editUser(json.data))
                }
                return json
            }
        )
    }
}


//delete user

export const deleteUserOnServer = (userId) => {
    return function (dispatch, getState) {
        return fetch('/api/users/' + userId,
            {
                method: "delete",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(deleteUser(userId))
                }
                return json
            }
        )
    }
}


export const loginUserOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/login',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addLoginUser(json.data))
                } else {
                    dispatch(loginFailed(json.message))
                }
                return json
            }
        )
    }
}


export const showUserInfo = () => {
    return function (dispatch, getState) {
        dispatch(initialize('user-profile', getState().user.loggedIn))
    }
}


export const updateUserSettingsOnServer = (user) => {
    return function (dispatch, getState) {
        return fetch('/api/users',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(updateUserProfileState(json.data))
                }
                return json
            }
        )
    }
}
