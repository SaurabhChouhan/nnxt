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
    selectedTab: SC.RELEASE_DASHBOARD_TAB,
    taskPlansOfReleasePlanDeveloper: []
}

const releaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_AVAILABLE_RELEASES:
            // add all releases from server

            return Object.assign({}, state, {allAvailableReleases: action.releases && Array.isArray(action.releases) && action.releases.length ? action.releases : []})

        case AC.ADD_RELEASES:
            // add all releases from server
            let allReleases = action.releases && Array.isArray(action.releases) && action.releases.length ? action.releases.map(r => {
                let plannedIterations = r.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
                let s = {
                    sumPlannedHours: 0,
                    sumEstimatedHours: 0,
                    sumReportedHours: 0,
                    sumEstimatedHoursCompletedTasks: 0,
                    sumPlannedHoursReportedTasks: 0,
                    sumProgressEstimatedHours: 0,
                    sumPlannedHoursEstimatedTasks: 0,
                    sumExpectedBilledHours: 0
                }

                plannedIterations.forEach(p => {
                    s.sumPlannedHours += p.plannedHours
                    s.sumEstimatedHours += p.estimatedHours
                    s.sumReportedHours += p.reportedHours
                    s.sumEstimatedHoursCompletedTasks += p.estimatedHoursCompletedTasks
                    s.sumPlannedHoursReportedTasks += p.plannedHoursReportedTasks
                    s.sumProgressEstimatedHours += p.estimatedHours * p.progress
                    s.sumPlannedHoursEstimatedTasks += p.plannedHoursEstimatedTasks
                    s.sumExpectedBilledHours += p.expectedBilledHours
                })

                let prg = s.sumProgressEstimatedHours / s.sumEstimatedHours
                s.progress = parseFloat(prg.toFixed(2))
                r.plannedStats = s
                return r;
            }) : []

            return Object.assign({}, state, {all: allReleases})


        case AC.RELEASE_SELECTED:
            // add selected release details from server
            // Select team

            let release = action.release

            let plannedIterations = release.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
            let s = {
                sumPlannedHours: 0,
                sumEstimatedHours: 0,
                sumReportedHours: 0,
                sumEstimatedHoursCompletedTasks: 0,
                sumPlannedHoursReportedTasks: 0,
                sumProgressEstimatedHours: 0,
                sumPlannedHoursEstimatedTasks: 0,
                sumExpectedBilledHours: 0
            }

            plannedIterations.forEach(p => {
                s.sumPlannedHours += p.plannedHours
                s.sumEstimatedHours += p.estimatedHours
                s.sumReportedHours += p.reportedHours
                s.sumEstimatedHoursCompletedTasks += p.estimatedHoursCompletedTasks
                s.sumPlannedHoursReportedTasks += p.plannedHoursReportedTasks
                s.sumProgressEstimatedHours += p.estimatedHours * p.progress
                s.sumPlannedHoursEstimatedTasks += p.plannedHoursEstimatedTasks
                s.sumExpectedBilledHours += p.expectedBilledHours
            })

            let prg = s.sumProgressEstimatedHours / s.sumEstimatedHours
            s.progress = parseFloat(prg.toFixed(2))
            release.plannedStats = s
            return Object.assign({}, state, {
                selectedRelease: release,
                teamOfRelease: [...action.release.team, ...action.release.nonProjectTeam]
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