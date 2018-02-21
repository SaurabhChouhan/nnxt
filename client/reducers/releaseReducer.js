import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASES:
            return Object.assign({}, state, {all: action.releases})
        case AC.ADD_RELEASE_PROJECT_SELECTED:
            return Object.assign({}, state, {
                selected: action.project
            })

        case AC.ADD_RELEASES_TASK:

            return Object.assign({}, state, {all: action.releasePlans})

        default:
            return state
    }
}

export default clientReducer