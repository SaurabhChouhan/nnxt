import {initialize} from 'redux-form'
import * as A from '../actions'
import * as AC from "./actionConsts"


export const addEmployeeSettingOnServer = (employeeSetting) => {
    return function (dispatch, getState) {
        return fetch('/api/employees/employee-setting',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeSetting)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(initialize("employee-setting", json.data))
                }
                return json
            }
        )
    }
}

export const getEmployeeSettingFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/employees/employee-setting',
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
                    dispatch(A.setEmployeeSettings(json.data))
                    dispatch(initialize("employee-setting", json.data))
                }
                return json
            }
        )
    }
}


export const updateEmployeeSettingOnServer = (employeeSetting) => {
    return function (dispatch, getState) {
        return fetch('/api/employees/employee-setting',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, *!/!*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeSetting)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(initialize("employee-setting", json.data))
                }
                return json
            }
        )
    }
}

export const addWorkCalendar = (calendar) => ({
    type: AC.ADD_WORK_CALENDAR,
    calendar: calendar
})

export const getEmployeeWorkCalendarFromServer = (employeeID, month, year, releaseID) => {

    return function (dispatch, getState) {
        let state = getState()
        if (month == undefined) {
            month = state.employee.workCalendar.month
        }
        if (year == undefined)
            year = state.employee.workCalendar.year

        let api = '/api/employees/' + employeeID + "/employee-schedule/" + month + "/year/" + year

        if (releaseID)
            api += '/release/' + releaseID

        return fetch(api,
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
                    dispatch(addWorkCalendar(json.data))
                }
                return json
            }
        )
    }
}

