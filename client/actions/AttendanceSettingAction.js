import * as AC from "./actionConsts"
import {initialize} from "redux-form"


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
                if (json.success) {
                    dispatch(addAttendanceSetting(json.data))
                }
                return json
            }
        )
    }
}
