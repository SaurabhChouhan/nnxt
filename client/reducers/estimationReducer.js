import {ADD_ESTIMATIONS, ADD_ESTIMATION} from "../actions/actionConsts"
import * as AC from '../actions/actionConsts'

let initialState = {
    all: [],
    selected: {}
}

const estimationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ESTIMATIONS:
            return Object.assign({}, state, {all: action.estimations})
        case AC.ADD_ESTIMATION:
            return Object.assign({}, state, {all: [...state.all, action.estimation]})
        case AC.EDIT_ESTIMATION:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.estimation._id ? action.estimation : item)})
        case AC.SELECT_ESTIMATION:
            return Object.assign({}, state, {selected: action.estimation})
        default:
            return state
    }
}

export default estimationReducer

