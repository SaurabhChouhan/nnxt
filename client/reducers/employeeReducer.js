import * as AC from "../actions/actionConsts";

let initialState = {
    workCalendar: {}
}

let employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_WORK_CALENDAR:
            return Object.assign({}, state, {
                workCalendar: action.calendar
            })
        case AC.RELEASE_PLAN_SELECTED:
            // clear past work calendar as user selected release plan again
            return Object.assign({}, state, {
                workCalendar: {}
            })
        default:
            return state
    }
}

export default employeeReducer