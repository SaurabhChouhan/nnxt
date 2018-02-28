import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {},
    selectedTask:{},
    taskPlanning:[]
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASES:
            return Object.assign({}, state, {all: action.releases})
        case AC.ADD_RELEASE_PROJECT_SELECTED:
            return Object.assign({}, state, {
                selected: action.project
            })
        case AC.RELEASE_TASK_SELECTED:
            return Object.assign({}, state, {
                selectedTask: action.task
            })
        case AC.ADD_TASK_PLANNING_TO_STATE:
            return Object.assign({}, state, {
                taskPlanning : [...state.taskPlanning,action.taskPlan]
            })
        case AC.DELETE_TASK_PLAN_FROM_STATE:
            return Object.assign({}, state, {
                taskPlanning: state.taskPlanning.filter(p => p.localId != action.planId && p._id == undefined)
            })
        case AC.ADD_RELEASES_TASK:
            return Object.assign({}, state, {all: action.releasePlans})

        case AC.ADD_RELEASES_TASK_PLANNING:
            return Object.assign({}, state, {
                taskPlanning: action.taskPlanning
            })
        default:
            return state
    }
}

export default clientReducer