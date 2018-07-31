import * as AC from "../actions/actionConsts";

let initialState = {
    workCalendar:{}
}

let employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_WORK_CALENDAR:
            return Object.assign({}, state, {
                workCalendar: action.calendar
            })
        default:
            return state
    }
}

export default employeeReducer