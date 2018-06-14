import * as AC from "../actions/actionConsts";
import * as U from "../../server/utils";

let initialState = {
    all: [],
    allYears: [],

}

let holidayReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_HOLIDAY:
            return Object.assign({}, state, {all: [...state.all, action.holiday]})

        case AC.ADD_HOLIDAYS:
            return Object.assign({}, state, {all: action.holidays})

        case AC.ADD_ALL_YEARS:
            let currentYear = U.getCurrentYear()
            let years = action.years && action.years.length ? action.years.map(y => y.calendarYear) : []
            return Object.assign({}, state, {allYears: years && years.length && years.findIndex(y => y == currentYear) != -1 ? years : [...years, currentYear]})

        case AC.DELETE_HOLIDAY:
            let holidayDateMoment = U.momentInUTC(action.holidayDateString)
            return Object.assign({}, state, {all: state.all.filter(item => !U.momentInUTC(item.dateString).isSame(holidayDateMoment))})

        case AC.UPDATE_HOLIDAY:
            return Object.assign({}, state, {
                all: state.all.map(item => item._id.toString() == action.holiday._id.toString() ? action.holiday : item)
            })


        default:
            return state
    }
}

export default holidayReducer