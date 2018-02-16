import * as AC from "../actions/actionConsts"

let initialState = {
    all: [],
    task: {},
    feature: {}
}

const repositoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.SELECT_REPOSITORY:
            return Object.assign({}, state, {all: action.repository})

        case AC.SELECT_TASK_FROM_REPOSITORY:
            return Object.assign({}, state, {task: action.task})

        case AC.SELECT_FEATURE_FROM_REPOSITORY:
            return Object.assign({}, state, {feature: action.feature})

        default:
            return state
    }
}

export default repositoryReducer

