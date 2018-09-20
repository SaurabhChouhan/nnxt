import {initialize} from 'redux-form'
import * as AC from "./actionConsts"

export const addAllNotifications = (allNotifications) => ({
    type: AC.ADD_ALL_NOTIFICATIONS,
    allNotifications
})

export const addAllTodayNotifications = (todayAllNotifications) => ({
    type: AC.ADD_TODAYS_ALL_NOTIFICATIONS,
    todayAllNotifications
})


/* GET , ADD , UPDATE All notifications from server APIs  BLOCK */

export const getAllActiveNotificationsFromServer = () => {
    return function (dispatch) {
        return fetch('/api/notifications/active',
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
                    dispatch(addAllNotifications(json.data))
                }
                return json
            }
        )
    }
}
export const getTodayNotifications = () => {
    return function (dispatch, getState) {
        return fetch('/api/notifications/notification-count-today',
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
                    dispatch(addAllTodayNotifications(json.data))
                }
                return json
            }
        )
    }
}

export const deleteNotificationsFromServer = (ids) => {
    return function (dispatch, getState) {
        return fetch('/api/users/delete-notifications',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ids: ids})
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    // dispatch(addAllNotifications(json.data))
                }
                return json
            }
        )
    }
}
