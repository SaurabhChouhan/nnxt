import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants"
import moment from 'moment'
import momentTZ from "moment-timezone";
import {DATE_FORMAT} from "../../server/serverconstants";

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
    expandDescriptionTaskList: false,
    fromSchedule: nowString,
    schedules: [],
    employeeSetting: {},
    selectedIteration: undefined,
    from: nowString,
    selectedTab: SC.RELEASE_DASHBOARD_TAB,
    taskPlansOfReleasePlanDeveloper: [],
    expandDescriptionTaskReportList: false,
    expandDescriptionReleaseTaskList: false,
    releasePlanFilters: {
        releaseID: undefined,
        startDate: undefined,
        endDate: undefined,
        status: '',
        flag: '',
        expandDescription: false
    },
    releaseFilters: {
        manager: undefined,
        leader: undefined,
        status: undefined,
        showActive: true
    }
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

                s.progress = s.sumEstimatedHours != 0 ? parseFloat((s.sumProgressEstimatedHours / s.sumEstimatedHours).toFixed(2)) : 0
                r.plannedStats = s
                return r;
            }) : []

            return Object.assign({}, state, {all: allReleases})

        case AC.ADD_RELEASE:
            let addedRelease = action.release
            let plannedItrs = addedRelease.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
            let sums = {
                sumPlannedHours: 0,
                sumEstimatedHours: 0,
                sumReportedHours: 0,
                sumEstimatedHoursCompletedTasks: 0,
                sumPlannedHoursReportedTasks: 0,
                sumProgressEstimatedHours: 0,
                sumPlannedHoursEstimatedTasks: 0,
                sumExpectedBilledHours: 0
            }

            plannedItrs.forEach(p => {
                sums.sumPlannedHours += p.plannedHours
                sums.sumEstimatedHours += p.estimatedHours
                sums.sumReportedHours += p.reportedHours
                sums.sumEstimatedHoursCompletedTasks += p.estimatedHoursCompletedTasks
                sums.sumPlannedHoursReportedTasks += p.plannedHoursReportedTasks
                sums.sumProgressEstimatedHours += p.estimatedHours * p.progress
                sums.sumPlannedHoursEstimatedTasks += p.plannedHoursEstimatedTasks
                sums.sumExpectedBilledHours += p.expectedBilledHours
            })

            sums.progress = sums.sumEstimatedHours != 0 ? parseFloat((sums.sumProgressEstimatedHours / sums.sumEstimatedHours).toFixed(2)) : 0
            addedRelease.plannedStats = sums
            return Object.assign({}, state, {all: [...state.all, addedRelease]})
            break;
        case AC.RELEASE_SELECTED:
            // add selected release details from server
            // Select team

            let release = action.release

            let releaseStartMoment = moment(momentTZ.utc(release.devStartDate).format(DATE_FORMAT))
            let releaseEndMoment = moment(momentTZ.utc(release.devEndDate).format(DATE_FORMAT))
            let now = moment(moment().format(DATE_FORMAT), DATE_FORMAT)

            let startDate = undefined
            let endDate = undefined
            if (now.isAfter(releaseEndMoment) || now.isBefore(releaseStartMoment))
                startDate = releaseStartMoment.format(DATE_FORMAT)
            else
                startDate = now.format(DATE_FORMAT)

            if (now.isAfter(releaseEndMoment) || now.isBefore(releaseStartMoment)) {
                // Show task plans of release date range
                endDate = releaseEndMoment.format(DATE_FORMAT)
            }

            let plannedIterations = release.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
            let sm = {
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
                sm.sumPlannedHours += p.plannedHours
                sm.sumEstimatedHours += p.estimatedHours
                sm.sumReportedHours += p.reportedHours
                sm.sumEstimatedHoursCompletedTasks += p.estimatedHoursCompletedTasks
                sm.sumPlannedHoursReportedTasks += p.plannedHoursReportedTasks
                sm.sumProgressEstimatedHours += p.estimatedHours * p.progress
                sm.sumPlannedHoursEstimatedTasks += p.plannedHoursEstimatedTasks
                sm.sumExpectedBilledHours += p.expectedBilledHours
            })

            sm.progress = sm.sumEstimatedHours != 0 ? parseFloat((sm.sumProgressEstimatedHours / sm.sumEstimatedHours).toFixed(2)) : 0
            release.plannedStats = sm
            return Object.assign({}, state, {
                selectedRelease: release,
                teamOfRelease: [...action.release.team, ...action.release.nonProjectTeam],
                releasePlanFilters: {
                    releaseID: release._id,
                    startDate,
                    endDate,
                    status: '',
                    flag: ''
                }
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

            let rls = action.release
            let itrs = rls.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
            let stats = {
                sumPlannedHours: 0,
                sumEstimatedHours: 0
            }

            itrs.forEach(p => {
                stats.sumPlannedHours += p.plannedHours
                stats.sumEstimatedHours += p.estimatedHours
            })

            rls.plannedStats = stats
            // update release dates details
            return Object.assign({}, state, {
                selectedRelease: rls
            })
        case AC.RELEASE_TAB_SELECTED:
            return Object.assign({}, state, {
                selectedTab: action.tab
            })
        case AC.ITERATION_SELECTED:
            return Object.assign({}, state, {
                selectedIteration: action.iteration
            })
        case AC.EXPAND_DESCRIPTION_TASK_LIST:
            return Object.assign({}, state, {
                expandDescriptionTaskList: action.flag
            })
        case AC.EXPAND_DESCRIPTION_TASK_REPORT_LIST:
            return Object.assign({}, state, {
                expandDescriptionTaskReportList: action.flag
            })
        case AC.EXPAND_DESCRIPTION_RELEASE_PLAN_LIST:
            return Object.assign({}, state, {
                releasePlanFilters: Object.assign({}, state.releasePlanFilters, {expandDescription: action.flag})
            })
        case AC.CHANGE_RELEASEPLAN_FILTERS:
            return Object.assign({}, state, {
                releasePlanFilters: Object.assign({}, action.filters)
            })
        case AC.CHANGE_RELEASE_FILTERS:
            return Object.assign({}, state, {
                releaseFilters: Object.assign({}, action.filters)
            })
        default:
            return state
    }
}

export default releaseReducer