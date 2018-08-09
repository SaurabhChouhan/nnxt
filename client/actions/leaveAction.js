import * as AC from "./actionConsts"
import {initialize} from 'redux-form'

export const addLeaves = (leaves) => ({
    type: AC.ADD_LEAVES,
    leaves: leaves
})

export const leaveSelected = (leave) => ({
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

export const revokeLeave = (leave) => ({
    type: AC.REVOKE_LEAVE,
    leave: leave
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
                    if (json.data.leave) {
                        dispatch(addLeave(json.data.leave))
                    }

                }
                return json
            }
        )
    }
}


export const deleteLeaveFromServer = (leaveID) => {
    return function (dispatch, getState) {
        return fetch('/api/leave/' + leaveID,
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
                    if (json.data.leave) {
                        dispatch(revokeLeave(json.data.leave))
                    }
                }
                return json
            }
        )
    }
}


export const rejectLeaveRequestFromServer = (leaveID, reason) => {
    return function (dispatch) {
        return fetch('/api/leave/' + leaveID + '/reject',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({reason: reason})
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    if (json.data.leave) {
                        dispatch(updateLeave(json.data.leave))
                    }

                }
                return json
            }
        )
    }
}

export const approveLeaveRequestFromServer = (leaveID, reason) => {
    console.log("leaveID", leaveID)
    return function (dispatch, getState) {
        return fetch('/api/leave/' + leaveID + '/approve/',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({reason: reason})
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    if (json.data.leave) {
                        dispatch(updateLeave(json.data.leave))
                    }
                }
                return json
            }
        )
    }
}

