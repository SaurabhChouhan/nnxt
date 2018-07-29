import * as AC from '../actions/actionConsts'
import * as SC from '../../server/serverconstants'

let initialState = {
    plannedWork: [],
    actualProgress: [],
    completedProgress: []
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.CALCULATE_RELEASE_STATS:

            let plannedWork = []
            let actualProgress = []
            let completedProgress = []

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
                let planned = parseFloat(((sumPlannedHours * 100) / sumEstimatedHours).toFixed(2))

                plannedWork.push({
                    ran: Math.random(), // added random as animation and label were not working simultaneously, need to remove this as soon as bug with rechart is fixed
                    total: 100,
                    planned: planned,
                    unplanned: parseFloat((100 - planned).toFixed(2))
                })

                // Actual Progress bar graph calculation (Pending + Completed)

                let sumProgressEstimatedHours = plannedIterations.reduce((sum, p) => {
                    return sum + p.estimatedHours * p.progress
                }, 0)

                let progress = sumProgressEstimatedHours / sumEstimatedHours
                progress = parseFloat(progress.toFixed(2))

                actualProgress.push({
                    ran: Math.random(),
                    total: 100,
                    progress: progress,
                    remaining: parseFloat((100 - progress).toFixed(2))
                })

                let sumEstimatedHoursCompletedTasks = plannedIterations.reduce((sum, p) => {
                    return sum + p.estimatedHoursCompletedTasks
                }, 0)

                let progressCompletedTasks = (sumEstimatedHoursCompletedTasks * 100) / sumEstimatedHours
                progressCompletedTasks = parseFloat(progressCompletedTasks.toFixed(2))
                let progressPendingTasks = parseFloat((progress - progressCompletedTasks).toFixed(2))

                completedProgress.push({
                    ran: Math.random(),
                    total: 100,
                    completed: progressCompletedTasks,
                    pending: progressPendingTasks,
                    remaining: parseFloat((100 - progress).toFixed(2))
                })
            }

            return Object.assign({}, state, {
                plannedWork,
                actualProgress,
                completedProgress
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