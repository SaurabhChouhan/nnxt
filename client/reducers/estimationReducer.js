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

        case AC.UPDATE_ESTIMATION_TASK:
            let feature = {}
            if (action.task && action.task.feature && action.task.feature._id && Array.isArray(state.features)) {
                feature = state.features.find(item => item._id == action.task.feature._id)
                if (feature && Array.isArray(feature.tasks)) {
                    feature.tasks = feature.tasks.map(item => item._id == action.task._id ?
                        Object.assign({}, action.task) : item)
                    return Object.assign({}, state, {
                        features: Array.isArray(state.features) ?
                            state.features.map(item => item._id == feature._id ?
                                Object.assign({}, feature) : item) : null
                    })
                }

            }
            else
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
                features: Array.isArray(state.features) ? state.features.map(item => {
                    if (item._id == action.feature._id) {
                        action.feature.tasks = item.tasks
                        return Object.assign({}, action.feature)
                    } else return item
                }) : null
            })

        case AC.MOVE_TASK_IN_FEATURE:
            return Object.assign({}, state, {
                tasks: state.tasks.filter(item => item._id != action.task._id),
                features: Array.isArray(state.features) && state.features.length > 0 ? state.features.map((feature, idx) => {
                    if (feature._id == action.task.feature._id) {
                        return Object.assign({}, feature, {
                                tasks: Array.isArray(feature.tasks) ? [...feature.tasks, Object.assign({}, action.task)] : [Object.assign({}, action.task)]
                            }
                        )
                    }
                    return feature
                }) : []
            })

        case AC.MOVE_TASK_OUTOF_FEATURE:
            /*
                As task is moved out, task would be added to tasks array and would be removed from feature it was part of
             */
            return Object.assign({}, state, {
                tasks: [...state.tasks, Object.assign({}, action.task)],
                features: Array.isArray(state.features) && state.features.length > 0 ? state.features.map((feature, idx) => {
                    if (feature._id == action.featureID) {
                        return Object.assign({}, feature, {
                            tasks: Array.isArray(feature.tasks) ? feature.tasks.filter(t => t._id != action.task._id) : []
                        })
                    }
                    return feature
                }) : []
            })

        case AC.DELETE_ESTIMATION_TASK:
            let featureTask = {}
            if (action.task && action.task.feature && action.task.feature._id && Array.isArray(state.features)) {
                featureTask = state.features.find(item => item._id == action.task.feature._id)
                if (featureTask && Array.isArray(featureTask.tasks)) {
                    featureTask.tasks = featureTask.tasks.filter(item => item._id != action.task._id)
                    return Object.assign({}, state, {
                        features: Array.isArray(state.features) ?
                            state.features.map(item => item._id == featureTask._id ?
                                Object.assign({}, featureTask) : item) : null
                    })
                }

            }
            else
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
                tasks: Array.isArray(action.estimation.tasks) && action.estimation.tasks.length > 0 ? action.estimation.tasks.filter(item => item.isDeleted == false) : [],
                features: Array.isArray(action.estimation.features) && action.estimation.features.length > 0 ? action.estimation.features.filter(item => item.isDeleted == false) : []
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

