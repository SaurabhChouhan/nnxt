import * as AC from "../actions/actionConsts"


let initialState = {
    allProjects: [],
    selectedProject: {},
    selectedTask: {},
    allTaskPlans: [],
    dateOfReport: new Date()
}

const reportingReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_REPORTING_PROJECTS:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                allProjects: action.projects
            })

        case AC.ADD_SELECTED_PROJECT_AND_REPORTING_TASK_PLANNINGS:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlans: undefined,
                }),
                allTaskPlans: action.project.taskPlans
            })

        case AC.NO_PROJECT_SECTED:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlans: undefined,
                }),
                allTaskPlans: action.project.taskPlans
            })

        case AC.SET_REPORT_DATE:
            // All Project where loggedIn user in involved as (manager,leader,developer) or that project
            return Object.assign({}, state, {
                dateOfReport: action.reportDate
            })


        default:
            return state
    }
}

export default reportingReducer