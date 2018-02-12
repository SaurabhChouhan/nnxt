import * as AC from "../actions/actionConsts"

let initialState = {
    all: []
}

const repositoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.SELECT_REPOSITORY:
            return Object.assign({}, state, {all: action})
        default:
            return state
    }
}

export default repositoryReducer

