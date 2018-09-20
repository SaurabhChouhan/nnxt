import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants";


let initialState = {
    todayAllNotifications:0
}

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ALL_NOTIFICATIONS:
            return Object.assign({}, state, {allNotifications: action.allNotifications})
        case AC.ADD_TODAYS_ALL_NOTIFICATIONS:
            return Object.assign({}, state, {todayAllNotifications: action.todayAllNotifications})
        default:
            return state
    }
}

export default notificationReducer