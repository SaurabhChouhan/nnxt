import {initialize} from 'redux-form'
import * as A from '../actions'

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
