import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],

}

let holidayReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_HOLIDAY:
            return Object.assign({}, state, {all: [...state.all, action.holiday]})

        default:
            return state
    }
}

export default holidayReducer