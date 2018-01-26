import {ADD_ESTIMATIONS, ADD_ESTIMATION} from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {}
}

const estimationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ESTIMATIONS:
            return Object.assign({}, state, {all: action.estimations})
        case ADD_ESTIMATION:
            return Object.assign({}, state, {all: [...state.all, action.estimation]})
        default:
            return state
    }
}

export default estimationReducer

