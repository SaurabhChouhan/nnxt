import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
}

const warningReducer = (state = initialState, action) => {

    switch (action.type) {
        case AC.ADD_WARNINGS:
            // add all warnings from server
            return Object.assign({}, state, {
                all: action.warnings
            })

        default:
            return state
    }
}

export default warningReducer