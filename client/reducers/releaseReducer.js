import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants"
import moment from 'moment'

let now = new Date()
let nowString = moment(now).format(SC.DATE_FORMAT)
let initialState = {
    all: [],
    projectTasks: [],
    selectedProject: {},
    selectedTask: {},
    taskPlans: [],
    developerPlans: [],
    expanded: false,
    fromSchedule: nowString,
    schedules: [],
    employeeSetting: {},
    from: nowString
}

const releaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_RELEASE_PROJECTS:
            // Stores all projects on Release section
            return Object.assign({}, state, {all: action.projects ? action.projects : []})

        case AC.RELEASE_PROJECT_SELECTED:
            // Stores selected project on Release section
            return Object.assign({}, state, {
                selectedProject: action.project
            })

        case AC.ADD_RELEASE_PROJECT_TASKS:
            // Stores all tasks on Release section of selected project
            return Object.assign({}, state, {projectTasks: action.releaseProjectTasks})


        case AC.RELEASE_TASK_PLAN_SELECTED:
            // Stores selected task details on Release section of selected project
            return Object.assign({}, state, {
                selectedTask: action.taskPlan
            })

        case AC.ADD_RELEASE_TASK_PLANNINGS:
            // Stores task planning details on Release section of selected tasks
            return Object.assign({}, state, {
                taskPlans: action.taskPlans,
                expanded: false
            })


        case AC.ADD_RELEASE_TASK_PLANNING_TO_STATE:
            // Add task planning to planning list
            return Object.assign({}, state, {
                taskPlans: [...state.taskPlans, action.taskPlan]
            })

        case AC.UPDATE_RELEASE_TASK_PLANNING_TO_STATE:
            // Add task planning to planning list
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.map(tp =>
                    (tp._id === action.taskPlan._id) ? Object.assign({}, action.taskPlan) : tp) : []
            })

        case AC.DELETE_TASK_PLAN:
            // Delete task planning from planning list
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.filter(plan => plan._id != action.planID) : []
            })


        case AC.ADD_DEVELOPER_FILTERED:
            // Developer planning details according to date time selection
            return Object.assign({}, state, {
                developerPlans: action.developerPlans
            })

        case AC.UPDATE_DEVELOPER_FILTERED:
            // Developer planning details according to date time selection
            return Object.assign({}, state, {
                developerPlans: state.developerPlans && Array.isArray(state.developerPlans) && state.developerPlans.length ?
                    state.developerPlans.map(dp =>
                        (dp._id === action.developerPlanned._id) ? Object.assign({}, action.developerPlanned) : dp) : []
            })

        case AC.EXPAND_DESCRIPTION:
            // Developer planning details according to date time selection
            return Object.assign({}, state, {
                expanded: action.flag
            })

        case AC.SET_DEVELOPERS_SCHEDULE:
            // Developer planning details according to date time selection
            return Object.assign({}, state, {
                schedules: action.schedules
            })

        case AC.SET_EMPLOYEE_SETTINGS:
            // Developer planning details according to date time selection
            return Object.assign({}, state, {
                employeeSetting: action.empSetting
            })

        case AC.SET_FROM_DATE:
            return Object.assign({}, state, {
                from: action.from
            })


        default:
            return state
    }
}

export default releaseReducer