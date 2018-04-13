import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    allReleases: [],
    selected: {},
    selectedTaskPlan: {},
    taskPlans: [],
    developerPlanned: []
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASE_PROJECTS:
            return Object.assign({}, state, {all: action.projects ? action.projects : []})

        case AC.RELEASE_PROJECT_SELECTED:
            return Object.assign({}, state, {
                selected: action.project
            })

        case AC.RELEASE_TASK_PLAN_SELECTED:
            return Object.assign({}, state, {
                selectedTaskPlan: action.taskPlan
            })

        case AC.ADD_TASK_PLANNING_TO_STATE:
            return Object.assign({}, state, {
                taskPlans: [...state.taskPlans, action.taskPlan]
            })

        case AC.DELETE_TASK_PLAN_FROM_STATE:
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.filter(plan => plan._id != action.planId) : []
            })

        case AC.ADD_RELEASES_TASK:
            return Object.assign({}, state, {allReleses: action.releasePlans})

        case AC.ADD_RELEASE_TASK_PLANNING:
            return Object.assign({}, state, {
                taskPlans: [...state.taskPlans, action.taskPlan]
            })

        case AC.ADD_DEVELOPER_FILTERED:
            return Object.assign({}, state, {
                developerPlanned: action.developerPlanned
            })

        default:
            return state
    }
}

export default clientReducer