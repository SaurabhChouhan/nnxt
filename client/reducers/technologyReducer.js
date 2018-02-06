import * as AC from '../actions/actionConsts'

let initialState = {
    all: [],
    selected: {}
}

let technologyReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_TECHNOLOGIES:
            return Object.assign({}, state, {all: action.technologies})
        case AC.ADD_TECHNOLOGY:
            return Object.assign({}, state, {all: [...state.all, action.technology]})
        case AC.DELETE_TECHNOLOGY:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.TechnologyID)})
        default:
            return state
    }
}

export default technologyReducer