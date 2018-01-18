import {
    SHOW_LOADER,
    HIDE_LOADER,
    SHOW_COMPONENT,
    HIDE_COMPONENT,
    ADD_SSR_FLAG,
    CLEAR_SSR_FLAG
} from "../actions/actionConsts"


let initialState = {
    showLoader: false, // used to show/hide loader gif
    ssrFlag: false, // used for server side rendering
    visibleComponents: [] // which components should be visible in a particular tab
}

const appReducer = (state = initialState, action) => {

    switch (action.type) {
        case SHOW_LOADER:
            return Object.assign({}, state, {
                showLoader: true
            })
        case HIDE_LOADER:
            return Object.assign({}, state, {
                showLoader: false
            })
        case SHOW_COMPONENT:
            return Object.assign({}, state, {
                visibleComponents: [action.name]
            })
        case HIDE_COMPONENT:
            return Object.assign({}, state, {
                visibleComponents: state.visibleComponents.filter(name => name !== action.name)
            })
        case ADD_SSR_FLAG:
            let newState = Object.assign({}, state, {
                ssrFlag: true
            })
            console.log("new state is ", newState)
            return newState
        case CLEAR_SSR_FLAG:
            return Object.assign({}, state, {
                ssrFlag: false
            })

        default:
            return state
    }
}

export default appReducer