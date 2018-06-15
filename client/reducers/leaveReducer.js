import * as AC from "../actions/actionConsts";

let initialState = {
    all: [],
    selected: {},
    leaveTypes: [],

}

let leaveReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_LEAVE_TYPES:
            return Object.assign({}, state, {leaveTypes: action.leaveTypes})

        case AC.ADD_LEAVES:
            return Object.assign({}, state, {all: action.leaveRequests})

        case AC.LEAVE_SELECTED:
            return Object.assign({}, state, {selected: action.leave})

        case AC.ADD_LEAVE:
            return Object.assign({}, state, {all: [...state.all, action.leave]})

        case AC.UPDATE_LEAVE:
            return Object.assign({}, state, {
                all: state.all.map(item => {
                    if (item._id.toString() !== action.leave._id.toString()) {
                        return Object.assign({}, action.leave)
                    } else return item
                })
            })

        case AC.DELETE_LEAVE:
            return Object.assign({}, state, {all: state.all.filter(item => item._id.toString() !== action.leave._id.toString())})


        default:
            return state
    }
}

export default leaveReducer