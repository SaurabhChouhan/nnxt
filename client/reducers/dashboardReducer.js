import * as AC from '../actions/actionConsts'
import * as SC from '../../server/serverconstants'

let initialState = {
    plannedWork: []
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.CALCULATE_RELEASE_STATS:

            let plannedWork = []

            let release = Object.assign({}, action.release)

            // To calculate percentage of planned work we need to iterate on all iterations of type 'planned' and then
            // sum all plannedHoursEstimatedTasks and then compare them against sum of all estimated hours
            let plannedIterations = release.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)
            console.log("planned iterations ", plannedIterations)

            if (plannedIterations && plannedIterations.length) {
                let sumPlannedHours = plannedIterations.reduce((sum, p) => {
                    return sum + p.plannedHoursEstimatedTasks
                }, 0)

                let sumEstimatedHours = plannedIterations.reduce((sum, p) => {
                    return sum + p.estimatedHours
                }, 0)

                console.log("sum planned hours ", sumPlannedHours)
                console.log("sum estimated hours ", sumEstimatedHours)
                let planned = Math.round((sumPlannedHours * 100) / sumEstimatedHours)

                plannedWork.push({
                    ran: Math.random(), // added random as animation and label were not working simultaneously, need to remove this as soon as bug with rechart is fixed
                    total: 100,
                    planned: planned,
                    unplanned: 100 - planned
                })
            }

            return Object.assign({}, state, {
                plannedWork
            })
        case AC.SET_RELEASE_ID:
            // while selection of reporting status it is set to state also
            return Object.assign({}, state, {
                selectedReleaseID: action.releaseID
            })
        case AC.ADD_USER_RELEASES:
            // All Releases where loggedIn user in involved as (manager, leader, developer)
            return Object.assign({}, state, {
                allReleases: action.releases
            })
        default:
            return state
    }
}
export default dashboardReducer