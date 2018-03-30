import * as AC from "./actionConsts"


export const addAttendanceSetting = (attendanceSetting) => ({
    type: AC.ADD_UPDATE_ATTENDENCE_SETTING,
    attendanceSetting: attendanceSetting
})


export const addAttendanceSettingOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/attendance/attendance-settings',
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
                if (json.success && json.data) {
                    dispatch(addAttendanceSetting(json.data))
                }
                return json
            }
        )
    }
}

export const getAttendanceSettingFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/attendance/attendance-settings',
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
                if (json.success && json.data) {
                    dispatch(initialize('attendance-setting', json.data))
                    dispatch(addAttendanceSetting(json.data))
                }
                return json
            }
        )
    }
}

