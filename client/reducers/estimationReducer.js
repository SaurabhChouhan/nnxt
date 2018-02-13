import * as AC from "../actions/actionConsts"

let initialState = {
    all: [],
    selected: {},
    tasks: [],
    features: [],
    expandedFeatureID: undefined,
    expandedTaskID: undefined

}

const estimationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ESTIMATION_TASK:
            // task is added to estimation, it would be added against selected estimation
            return Object.assign({}, state, {
                tasks: Array.isArray(state.tasks) ? [...state.tasks, action.task] : [action.task]
            })

        case AC.MOVE_TASK_IN_FEATURE:
            return Object.assign({}, state, {
                tasks: state.tasks.filter(item => item._id != action.task._id),
                features: Array.isArray(state.features) && state.features.length > 0 ? state.features.map((feature, idx) => {
                    if (feature._id == action.task.feature._id) {
                        if (feature.tasks && Array.isArray(feature.tasks)) {
                            feature.tasks.push(action.task)
                        } else feature.tasks = [action.task]
                    }
                    return feature
                }) : []
            })

        case AC.UPDATE_ESTIMATION_TASK:
            return Object.assign({}, state, {
                tasks: Array.isArray(state.tasks) ?
                    state.tasks.map(item => item._id == action.task._id ?
                        Object.assign({}, action.task) : item) : null
            })

        case AC.ADD_ESTIMATION_FEATURE:
            // feature is added to estimation, it would be added against selected estimation
            return Object.assign({}, state, {
                features: Array.isArray(state.features) ? [...state.features, action.feature] : [action.feature]
            })
        case AC.UPDATE_ESTIMATION_FEATURE:
            // feature is added to estimation, it would be added against selected estimation
            return Object.assign({}, state, {
                features: Array.isArray(state.features) ? state.features.map(item => item._id == action.feature._id ? Object.assign({}, action.feature) : item) : null
            })

        /*
        case AC.REQUEST_FOR_TASK_EDIT_PERMISSION:
            return Object.assign({}, state, {tasks: state.tasks.map(item => item._id == action.task._id ? action.task : item)})
            */

        case AC.DELETE_ESTIMATION_TASK:
            return Object.assign({}, state, {tasks: state.tasks.filter(item => item._id != action.task._id)})

        case AC.ADD_ESTIMATIONS:
            return Object.assign({}, state, {all: action.estimations})

        case AC.ADD_ESTIMATION:
            return Object.assign({}, state, {all: [...state.all, action.estimation]})

        case AC.EDIT_ESTIMATION:
            return Object.assign({}, state, {
                all: state.all.map(item => item._id == action.estimation._id ? action.estimation : item),
                selected: Object.assign({}, action.estimation)
            })

        case AC.SELECT_ESTIMATION:
            return Object.assign({}, state, {
                selected: Object.assign({}, action.estimation, {
                    tasks: undefined,
                    features: undefined
                }),
                tasks: [...action.estimation.tasks],
                features: [...action.estimation.features]
            })

        case AC.DELETE_ESTIMATION_FEATURE:
            return Object.assign({}, state, {features: state.features.filter(item => item._id != action.feature._id)})

        case AC.EXPAND_FEATURE:
            // Compare expanded feature ID with expanded feature id of state

            if (state.expandedFeatureID && state.expandedFeatureID == action.featureID) {
                // Feature was expanded and clicked again, so contract
                return Object.assign({}, state, {
                    expandedFeatureID: undefined,
                    expandedTaskID: undefined
                })
            }

            return Object.assign({}, state, {
                expandedFeatureID: action.featureID,
                expandedTaskID: undefined
            })
        case AC.EXPAND_TASK:
        case AC.EXPAND_FEATURE:
            // Compare expanded task ID with expanded task id of state

            if (state.expandedTaskID && state.expandedTaskID == action.taskID) {
                // Feature was expanded and clicked again, so contract
                return Object.assign({}, state, {
                    expandedFeatureID: undefined,
                    expandedTaskID: undefined
                })
            }

            return Object.assign({}, state, {
                expandedFeatureID: undefined,
                expandedTaskID: action.taskID
            })

        default:
            return state
    }
}

export default estimationReducer

