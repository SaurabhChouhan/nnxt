import * as AC from "./actionConsts"


export const addAllYears = (years) => ({
    type: AC.ADD_ALL_YEARS,
    years: years
})

export const deleteHoliday = (holidayDateString) => ({
    type: AC.DELETE_HOLIDAY,
    holidayDateString: holidayDateString
})

export const addAllHolidays = (holidays) => ({
    type: AC.ADD_HOLIDAYS,
    holidays: holidays
})

export const addHoliday = (holiday) => ({
    type: AC.ADD_HOLIDAY,
    holiday: holiday
})

export const updateHoliday = (holiday) => ({
    type: AC.UPDATE_HOLIDAY,
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
                    dispatch(getAllHolidaysOfYearFromServer(json.data.calendarYear))
                    dispatch(getAllHolidayYearsFromServer())
                }
                return json
        })
    }
}

export const deleteHolidayOnServer = (holidayDateString) => {
    return function (dispatch, getState) {
        return fetch('/api/holiday/' + holidayDateString,
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
                    return dispatch(getAllHolidaysOfYearFromServer(json.data.calendarYear))
                }
                return json
            }
        )
    }
}


export const updateHolidayOnServer = (formInput) => {
    console.log("formInput", formInput)
    return function (dispatch, getState) {
        return fetch('/api/holiday',
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
                    dispatch(getAllHolidaysOfYearFromServer(json.data.calendarYear))
                    if (json.data.yearChange) {
                        dispatch(getAllHolidayYearsFromServer())
                    }
                }
                return json
            }
        )
    }
}

