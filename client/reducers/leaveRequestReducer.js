import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {},
    leaveTypes:[],

}

let leaveRequestReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_LEAVE_REQUESTS:
            return Object.assign({}, state, {all: action.leaveRequests})

        case AC.ADD_LEAVE_REQUEST:
            return Object.assign({}, state, {all: [...state.all, action.leaveRequest]})

        case AC.ADD_LEAVE_TYPES:
            return Object.assign({}, state, {leaveTypes: action.leaveTypes})

        default:
            return state
    }
}

export default leaveRequestReducer