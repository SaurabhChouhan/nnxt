import * as AC from "./actionConsts"
import {initialize} from "redux-form"


export const addAttendenceSetting = (attendenceSetting) => ({
    type: AC.ADD_UPDATE_ATTENDENCE_SETTING,
    attendenceSetting: attendenceSetting
})


export const addAttendenceSettingOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/attendance/admin-attendance-settings',
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
                    dispatch(addAttendenceSetting(json.data))

                }
                return json
            }
        )
    }
}
