import * as AC from '../actions/actionConsts'

let initialState = {
    all: [],
    selected: {}
}

let developmentTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_DEVELOPMENT_TYPES:
            return Object.assign({}, state, {all: action.developmentTypes})
        case AC.ADD_DEVELOPMENT_TYPE:
            return Object.assign({}, state, {all: [...state.all, action.developmentType]})
        case AC.DELETE_DEVELOPMENT_TYPE:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.developmentTypeID)})
        default:
            return state
    }
}

export default developmentTypeReducer