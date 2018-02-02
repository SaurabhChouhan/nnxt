import {ADD_ESTIMATIONS, ADD_ESTIMATION} from "../actions/actionConsts"
import * as AC from '../actions/actionConsts'

let initialState = {
    all: [],
    selected: {},
    tasks: [],
    features: []
}

const estimationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ESTIMATION_TASK:
            // task is added to estimation, it would be added against selected estimation
            return Object.assign({}, state, {
                tasks: Array.isArray(state.tasks) ? [...state.tasks, action.task] : [action.task]
            })
        case AC.ESTIMATION_TASK_DELETE:
            return Object.assign({}, state, {
                tasks: state.tasks.map(t => {
                    if (t._id == action.taskID) {
                        return Object.assign({}, t, {estimator: Object.assign({}, t.estimator, {removalRequested: !t.estimator.removalRequested})})
                    }
                    return t
                })
            })
        case AC.ADD_ESTIMATIONS:
            return Object.assign({}, state, {all: action.estimations})
        case AC.ADD_ESTIMATION:
            return Object.assign({}, state, {all: [...state.all, action.estimation]})
        case AC.EDIT_ESTIMATION:
            return Object.assign({}, state, {all: state.all.map(item => item._id == action.estimation._id ? action.estimation : item)})
        case AC.SELECT_ESTIMATION:
            return Object.assign({}, state, {
                selected: Object.assign({}, action.estimation, {
                    tasks: undefined,
                    features: undefined
                }),
                tasks: [...action.estimation.tasks],
                features: [...action.estimation.features]
            })
        default:
            return state
    }
}

export default estimationReducer

