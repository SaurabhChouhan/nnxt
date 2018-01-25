import {
    ADD_ROLE,
    ADD_ROLES,
    EDIT_ROLE,
    DELETE_ROLE,
    ADMIN_EDITING_ROLE
} from "./actionConsts"

export const addAllRoles = (roles) => ({
        type: ADD_ROLES,
        roles: roles
    }
)

export const addRole = (role) => ({
    type: ADD_ROLE,
    role: role
})

export const editRole = (role) => ({
    type: EDIT_ROLE,
    role: role
})

export const deleteRole = (role) => ({
    type: DELETE_ROLE,
    role: role
})

export const adminEditingRole = (role) => ({
    type: ADMIN_EDITING_ROLE,
    role: role
})

export const addRoleOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/roles', {
            method: 'post',
            credentials: "include",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formInput)
        }).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(addRole(json.data))
            } else {
            }
            return json
        })
    }
}

export const editRoleOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/roles', {
            method: 'put',
            credentials: "include",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formInput)
        }).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(editRole(json.data))
            }
            return json
        })
    }
}

export const deleteRoleOnServer = (roleID) => {
    return function (dispatch, getState) {
        return fetch('/api/roles/' + roleID, {
            method: 'delete',
            credentials: "include",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(deleteRole(json.data))
            }
            return json
        })
    }
}


export const getAllRolesFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/roles', {
            method: 'get',
            credentials: "include",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(addAllRoles(json.data))
            }
            return json
        })
    }
}