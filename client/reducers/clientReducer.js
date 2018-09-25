import * as AC from "../actions/actionConsts"
import {CLIENT_ARIPRA} from "../clientconstants";


let initialState = {
    all: [],
    billable: [],
    selected: {}
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_CLIENTS:
            return Object.assign({}, state, {
                all: action.clients
                ,
                billable: action.clients && action.clients.length ? action.clients.filter(c => c.name !== CLIENT_ARIPRA) : []
            })

        case AC.ADD_CLIENT:
            return Object.assign({}, state, {all: [...state.all, action.client]})

        case AC.DELETE_CLIENT:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.clientID)})

        case AC.UPDATE_CLIENT:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.client._id ? action.client : item)})
        case AC.UPDATE_TOGGLE_CLIENT:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.client._id ? action.client : item)})

        default:
            return state
    }
}

export default clientReducer