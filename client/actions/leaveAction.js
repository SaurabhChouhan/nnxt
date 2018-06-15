import * as AC from "./actionConsts"
import {initialize} from 'redux-form'

export const addLeaves = (leaves) => ({
    type: AC.ADD_LEAVES,
    leaves: leaves
})

export const selectLeave = (leave) => ({
    type: AC.LEAVE_SELECTED,
    leave: leave
})

export const addLeave = (leave) => ({
    type: AC.ADD_LEAVE,
    leave: leave
})

export const updateLeave = (leave) => ({
    type: AC.UPDATE_LEAVE,
    leave: leave
})


export const deleteLeave = (leave) => ({
    type: AC.DELETE_LEAVE,
    leaveRequest: leave
})

export const addLeaveTypes = (leaveTypes) => ({
    type: AC.ADD_LEAVE_TYPES,
    leaveTypes: leaveTypes
})

/*-----------------------  LEAVE SETTING SECTION ---------------------------------*/


export const getLeaveSettingFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/leave/leave-setting',
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
                    dispatch(initialize("leave-setting", json.data))
                }
                return json
            }
        )
    }
}


export const addLeaveSettingOnServer = (leaveSetting) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/leave-setting',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leaveSetting)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(initialize("leave-setting", json.data))
                }
                return json
            }
        )
    }
}


export const updateLeaveSettingOnServer = (leaveSetting) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/leave-setting',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, *!/!*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leaveSetting)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(initialize("leave-setting", json.data))
                }
                return json
            }
        )
    }
}

/*---------------------------  LEAVE SECTION --------------------------------------*/

export const getAllLeaveTypesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/leave/leave-types', {
                method: 'get',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addLeaveTypes(json.data))
                }
            })

    }
}


export const getAllLeavesFromServer = (status) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/' + status,
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
                dispatch(addLeaves(json.data))
            }
            return json
        })
    }
}

export const addLeaveRequestOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/leave',
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
                    dispatch(addLeave(json.data))
                }
                return json
            }
        )
    }
}


export const deleteLeaveRequestFromServer = (leaveID) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/' + leaveID + '/delete-request',
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
                    dispatch(deleteLeave(json.data))
                }
                return json
            }
        )
    }
}


export const cancelLeaveRequestFromServer = (leaveID) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/cancel-request',
            {
                method: "put",
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
                    dispatch(updateLeave(json.data))
                }
                return json
            }
        )
    }
}
