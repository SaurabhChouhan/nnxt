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
                selected: Object.assign({}, action.estimation, {
                    tasks: undefined,
                    features: undefined,
                }),
                tasks: Array.isArray(action.estimation.tasks) && action.estimation.tasks.length > 0 ? action.estimation.tasks.filter(t => t.isDeleted == false) : [],
                features: Array.isArray(action.estimation.features) && action.estimation.features.length > 0 ?
                    action.estimation.features.filter(f => {
                            if (f.isDeleted == false) {
                                if (Array.isArray(f.tasks) && f.tasks.length > 0)
                                    f.tasks = f.tasks.filter(t => t.isDeleted == false)

                                return true;
                            }
                            else return false
                        }
                    ) : [],

                expandedFeatureID: undefined,
                expandedTaskID: undefined,
                filter: {
                    changedByNegotiator: true,
                    changedByEstimator: true,
                    permissionRequested: true,
                    addedFromRepository: true,
                    addedByNegotiator: true,
                    addedByEstimator: true,
                    hasError: true

                }
            })
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlans: undefined,
                }),
                allTaskPlans: action.project.taskPlans
            })


        default:
            return state
    }
}

export default reportingReducer