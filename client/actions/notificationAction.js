import {initialize} from 'redux-form'
import * as AC from "./actionConsts"

export const addAllNotifications = (allNotifications) => ({
    type: AC.ADD_ALL_NOTIFICATIONS,
    allNotifications
})



/* GET , ADD , UPDATE All notifications from server APIs  BLOCK */

export const getAllNotificationsFromServer = (type) => {
    return function (dispatch, getState) {
        return fetch('/api/users/notifications/type/'+type,
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
