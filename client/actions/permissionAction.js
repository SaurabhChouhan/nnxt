import * as AC from './actionConsts'
import * as logger from '../clientLogger'


export const addAllPermissions = (permissions) => ({
        type: AC.ADD_PERMISSIONS,
        permissions: permissions
})

export const addPermission = (permission) => ({
    type: AC.ADD_PERMISSION,
    permission: permission
})

export const editPermission = (permission) => ({
    type: AC.EDIT_PERMISSION,
    permission: permission
})
export const deletePermission = (PermissionID) => ({
    type: AC.DELETE_PERMISSION,
    PermissionID: PermissionID
})

export const addPermissionOnServer = (formInput) => {
    logger.debug(logger.PERMISSION_THUNK, 'addPermissionOnServer()')
    return function (dispatch, getState) {
        return fetch('/api/permissions',
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
                    dispatch(addPermission(json.data))
                }
                return json
            }
        )
    }
}

export const editPermissionOnServer = (formInput) => {
    logger.debug(logger.PERMISSION_THUNK, 'editPermissionOnServer()')
    return function (dispatch, getState) {
        return fetch('/api/permissions',
            {
                method: "put",
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
                    dispatch(editPermission((json.data)))
                }
                return json
            }
        )
    }
}

export const deletePermissionOnServer = (PermissionId) => {
    return function (dispatch, getState) {
        return fetch('/api/permissions/' + PermissionId,
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
                    dispatch(deletePermission(PermissionId))
                    // clear user form after update is successful
                }
                return json
            }
        )
    }
}


export const getAllPermissionsFromServer = () => {
    logger.debug(logger.PERMISSION_THUNK, 'getAllPermissionsFromServer()')
    return function (dispatch, getState) {
        return fetch('/api/permissions',
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
                    dispatch(addAllPermissions(json.data))
                }
                return json
        })
    }
}

