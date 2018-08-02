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

export const getEmployeeWorkCalendarFromServer = (employeeID, month, year) => {
    console.log("inside getEmployeeWorkCalendarFromServer")
    return function (dispatch, getState) {

        console.log("inside function of getEmployeeWorkCalendarFromServer")

        let state = getState()

        console.log("state found as ", state)

        if(month == undefined) {
            month = state.employee.workCalendar.month
        }
        if(year == undefined)
            year = state.employee.workCalendar.year

        console.log("calling API [/api/employees/' + employeeID + /employee-schedule/" + month + "/year/" + year)

        return fetch('/api/employees/' + employeeID + "/employee-schedule/" + month + "/year/" + year,
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

