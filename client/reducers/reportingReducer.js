import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selectedProject: {},
    selectedTask: {},
    alltaskPlans: []
}

const reportingReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_REPORTING_PROJECTS:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                all: action.projects
            })


        default:
            return state
    }
}

export default reportingReducer