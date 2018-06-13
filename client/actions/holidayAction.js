import * as AC from "./actionConsts"


export const addAllYears = (years) => ({
    type: AC.ADD_ALL_YEARS,
    years: years
})

export const deleteHoliday = (holidayID) => ({
    type: AC.DELETE_HOLIDAY,
    holidayID: holidayID
})

export const addAllHolidays = (holidays) => ({
    type: AC.ADD_HOLIDAYS,
    holidays: holidays
})

export const addHoliday = (holiday) => ({
    type: AC.ADD_HOLIDAY,
    holiday: holiday
})

export const editHoliday = (holiday) => ({
    type: AC.EDIT_HOLIDAY,
    holiday: holiday
})


export const getAllHolidayYearsFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/holiday/years',
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
                    dispatch(addAllYears(json.data))

                }
                return json
            }
        )
    }
}


export const getAllHolidaysOfYearFromServer = (year) => {
    return function (dispatch, getState) {
        return fetch('/api/holiday/holidays/' + year + '/year',
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
                    dispatch(addAllHolidays(json.data))
                }
                return json
            }
        )
    }
}


export const addHolidayOnServer = (formInput) => {
    console.log("inside action", formInput)
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

export const deleteHolidayOnServer = (holidayId) => {
    return function (dispatch, getState) {
        return fetch('/api/holiday/' + holidayId,
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
                    dispatch(deleteHoliday(holidayId))
                }
                return json
            }
        )
    }
}


export const editHolidayOnServer = (holiday) => {
    return function (dispatch, getState) {
        return fetch('/api/holiday',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(holiday)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(editHoliday(json.data))
                }
                return json
            }
        )
    }
}

