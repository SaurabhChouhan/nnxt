import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {}
}

let leaveRequestReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_LEAVE_REQUESTS:
            return Object.assign({}, state, {all: action.leaveRequests})

        case AC.ADD_LEAVE_REQUEST:
            return Object.assign({}, state, {all: [...state.all, action.leaveRequest]})

        default:
            return state
    }
}

export default leaveRequestReducer