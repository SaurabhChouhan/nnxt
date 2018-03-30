import {initialize} from 'redux-form'
import {
    ADD_LOGIN_USER,
    ADD_USER,
    ADD_USERS,
    ADD_USERS_WITH_ROLE_CATEGORY,
    DELETE_USER,
    EDIT_USER,
    LOGIN_FAILED,
    UPDATE_USER_PROFILE_STATE
} from "./actionConsts"


export const addLoginUser = (user) => ({
    type: ADD_LOGIN_USER,
    user: user
})

export const loginFailed = (error) => ({
    type: LOGIN_FAILED,
    error: error
})

export const addAllUsers = (users) => ({
    type: ADD_USERS,
    users: users
})

export const addUsersWithRoleCategory = (users) => ({
    type: ADD_USERS_WITH_ROLE_CATEGORY,
    users: users
})

export const addUser = (user) => ({
    type: ADD_USER,
    user: user
})

export const editUser = (user) => ({
    type: EDIT_USER,
    user: user
})

export const deleteUser = (userID) => ({
    type: DELETE_USER,
    userID: userID
})
export const updateUserProfileState = (user) => ({
    type: UPDATE_USER_PROFILE_STATE,
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

export function showUserInfo() {
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
                    dispatch(initialize('user-profile', json.data))

                }
                return json
            }
        )
    }
}
