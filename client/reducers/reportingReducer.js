import * as AC from "../actions/actionConsts"


let initialState = {
    allProjects: [],
    selectedProject: {},
    selectedTask: {},
    allTaskPlans: [],
    releaseID: '',
    status: 'all',
    selectedReleasePlan: {},
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
            // Selected Project and its task plans are fetched
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlans: undefined,
                }),
                allTaskPlans: action.project.taskPlans
            })

        case AC.NO_PROJECT_SELECTED:
            // When no project is selected then show dummy data
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlans: undefined,
                }),
                allTaskPlans: action.project.taskPlans
            })

        case AC.SET_REPORT_DATE:
            // while selection of reporting date it is set to state also
            return Object.assign({}, state, {
                dateOfReport: action.reportDate
            })

        case AC.SET_STATUS:
            // while selection of reporting status it is set to state also
            return Object.assign({}, state, {
                status: action.status
            })

        case AC.SET_PROJECT_ID:
            // while selection of reporting releaseId it is set to state also
            return Object.assign({}, state, {
                releaseID: action.releaseId
            })

        case AC.TASK_PROJECT_SELECTED:
            // task is selected to see task detail
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlan: undefined,
                    releasePlan: undefined
                }),
                selectedTask: action.project.taskPlan,
                selectedReleasePlan: action.project.releasePlan
            })
        case AC.UPDATE_SELECTED_TASK:
            // task is selected to see task detail
            return Object.assign({}, state, {
                selectedTask: action.project.taskPlan
            })

        case AC.UPDATE_SELECTED_RELEASE_PLAN:
            // task is selected to see task detail
            return Object.assign({}, state, {
                selectedReleasePlan: action.releasePlan
            })


        default:
            return state
    }
}

export default reportingReducer