import * as AC from "./actionConsts"


export const addHoliday = (holiday) => ({
    type: AC.ADD_HOLIDAY,
    holiday: holiday
})

export const addHolidayOnServer = (formInput) => {
    console.log("inside action",formInput)
    return function (dispatch, getState) {
        return fetch('/api/holiday/',
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
                    dispatch(addHoliday(json.data))
                }

                return json
            }
        )
    }
}