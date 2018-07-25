import * as AC from '../actions/actionConsts'
import moment from 'moment'
import * as SC from '../../server/serverconstants'
import * as U from '../../server/utils'

let now = new Date()
let initialState = {
    allReleases: [],
    availableReleases: [],
    taskPlan: {},
    releasePlan: {},
    release: {},
    releaseID: SC.ALL,
    reportedStatus: SC.ALL,
    dateStringOfReport: U.getNowStringInIndia()
}

const reportingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_USER_RELEASES:
            // All Releases where loggedIn user in involved as (manager, leader, developer)
            return Object.assign({}, state, {
                allReleases: action.releases
            })

        case AC.ADD_RELEASES_AND_TASKS_OF_SELECTED_DATE:
            // Releases and its task plans where loggedIn user in involved as (manager, leader, developer) for selected date
            return Object.assign({}, state, {
                availableReleases: action.releases,
                dateStringOfReport: action.date
            })

        case AC.REPORT_TASK_SELECTED:
            // task is selected to see task detail
            return Object.assign({}, state, {
                taskPlan: action.taskPlan,
                releasePlan: Object.assign({}, action.releasePlan, {
                    estimationDescription: action.estimationDescription
                }),
                release: action.release
            })

        case AC.UPDATE_SELECTED_TASK_PLAN:
            // task is selected to see task detail
            return Object.assign({}, state, {
                taskPlan: action.project.taskPlan
            })

        case AC.UPDATE_SELECTED_RELEASE_PLAN:
            // task is selected to see task detail
            return Object.assign({}, state, {
                releasePlan: action.releasePlan
            })

        case AC.SET_REPORT_DATE:
            // while selection of reporting date it is set to state also
            return Object.assign({}, state, {
                dateStringOfReport: action.reportDate
            })

        case AC.SET_STATUS:
            // while selection of reporting status it is set to state also
            return Object.assign({}, state, {
                status: action.status
            })

        case AC.SET_RELEASE_ID:
            // while selection of reporting status it is set to state also
            return Object.assign({}, state, {
                releaseID: action.releaseID
            })


        default:
            return state
    }
}

export default reportingReducer