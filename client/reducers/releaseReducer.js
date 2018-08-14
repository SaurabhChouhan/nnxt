import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants"
import moment from 'moment'

let now = new Date()
let nowString = moment(now).format(SC.DATE_FORMAT)
let initialState = {
    allAvailableReleases: [],
    all: [],
    releasePlans: [],
    selectedRelease: {},
    selectedReleasePlan: {},
    teamOfRelease: [],
    taskPlans: [],
    developerPlans: [],
    expanded: false,
    fromSchedule: nowString,
    schedules: [],
    employeeSetting: {},
    from: nowString,
    selectedTab: SC.RELEASE_DASHBOARD_TAB
}

const releaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_AVAILABLE_RELEASES:
            // add all releases from server
            return Object.assign({}, state, {allAvailableReleases: action.releases && Array.isArray(action.releases) && action.releases.length ? action.releases : []})

        case AC.ADD_RELEASES:
            // add all releases from server
            return Object.assign({}, state, {all: action.releases && Array.isArray(action.releases) && action.releases.length ? action.releases : []})

        case AC.RELEASE_SELECTED:
            // add selected release details from server
            // Select team
            return Object.assign({}, state, {
                selectedRelease: action.release,
                teamOfRelease: [...action.release.team, ...action.release.nonProjectTeam],
                selectedTab: SC.RELEASE_DASHBOARD_TAB
            })

        case AC.ADD_RELEASE_PLANS:
            // adding release plan li
            return Object.assign({}, state, {releasePlans: action.releasePlans})


        case AC.RELEASE_PLAN_SELECTED:
            // selecting release plan and its initial data
            return Object.assign({}, state, {
                selectedReleasePlan: action.releasePlan,
                expanded: false,
                developerPlans: []
            })

        case AC.UPDATE_RELEASE_PLAN:
            // update release plan details
            return Object.assign({}, state, {
                selectedReleasePlan: action.releasePlan
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

        case AC.UPDATE_TASK_PLANNING:
            // update task planning from planning list
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.map(tp =>
                    (tp._id === action.taskPlan._id) ? Object.assign({}, action.taskPlan) : tp) : []
            })

        case AC.UPDATE_TASK_PLANS:
            // update task plans from planning list
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.map(tp => {
                    if (action.taskPlans.findIndex(taskPlan => taskPlan._id.toString() === tp._id.toString() === -1))
                        return tp
                    else return action.taskPlans.find(taskPlan => taskPlan._id.toString() === tp._id.toString())
                }) : []

            })

        case AC.DELETE_TASK_PLAN:
            // Delete task planning from planning list
            return Object.assign({}, state, {
                taskPlans: state.taskPlans && Array.isArray(state.taskPlans) && state.taskPlans.length ? state.taskPlans.filter(plan => plan._id.toString() !== action.planID.toString()) : []
            })


        case AC.ADD_DEVELOPER_FILTERED:
            // Stores Developer planning details according to Developer selection  and date  selection
            return Object.assign({}, state, {
                developerPlans: action.developerPlans
            })

        case AC.UPDATE_DEVELOPER_FILTERED:
            // Update Developer Task planning details
            return Object.assign({}, state, {
                developerPlans: state.developerPlans && Array.isArray(state.developerPlans) && state.developerPlans.length ?
                    state.developerPlans.map(dp =>
                        (dp._id === action.developerPlanned._id) ? Object.assign({}, action.developerPlanned) : dp) : []
            })

        case AC.EXPAND_DESCRIPTION:
            return Object.assign({}, state, {
                expanded: action.flag
            })

        case AC.SET_DEVELOPERS_SCHEDULE:
            // Show Developer task planning Schedule
            return Object.assign({}, state, {
                schedules: action.schedules
            })

        case AC.SET_EMPLOYEE_SETTINGS:
            // show Developer  status according to Planned task on developer
            return Object.assign({}, state, {
                employeeSetting: action.empSetting
            })

        case AC.SET_FROM_DATE:
            return Object.assign({}, state, {
                from: action.date
            })
        case AC.ADD_TASK_PLANNINGS:
            // add all task-plannings from server
            return Object.assign({}, state, {
                taskPlans: action.taskPlannings
            })
        case AC.UPDATE_RELEASE_DATES:
            // update release dates details
            return Object.assign({}, state, {
                selectedRelease: action.releaseDates
            })
        case AC.RELEASE_TAB_SELECTED:
            return Object.assign({}, state, {
                selectedTab: action.tab
            })
        default:
            return state
    }
}

export default releaseReducer