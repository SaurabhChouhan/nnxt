import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants";


let initialState = {
}

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_ALL_NOTIFICATIONS:
            return Object.assign({}, state, {allNotifications: action.allNotifications})

        default:
            return state
    }
}

export default notificationReducer