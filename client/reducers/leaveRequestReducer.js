import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {},
    leaveTypes: [],

}

let leaveRequestReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_LEAVE_REQUESTS:
            return Object.assign({}, state, {all: action.leaveRequests})
        case AC.ADD_LEAVE_REQUEST:
            return Object.assign({}, state, {all: [...state.all, action.leaveRequest]})
        case AC.CANCEL_LEAVE_REQUEST:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.leaveRequest._id ? action.leaveRequest : item)})
        case AC.ADD_LEAVE_TYPES:
            return Object.assign({}, state, {leaveTypes: action.leaveTypes})
        case AC.SELECTED_LEAVE_DETAIL:
            return Object.assign({}, state, {selected: action.leaveDetail})
        default:
            return state
    }
}

export default leaveRequestReducer