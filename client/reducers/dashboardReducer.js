import * as AC from '../actions/actionConsts'
import * as SC from '../../server/serverconstants'

let initialState = {
    plannedVsUnplannedWork: {},
    overallProgress: {},
    completedPendingProgress: {},
    plannedVsReported: {},
    hoursData: {},
    estimatedProgress: []
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.CALCULATE_RELEASE_STATS:

            let plannedVsUnplannedWork = {}
            let overallProgress = {}
            let completedPendingProgress = {}
            let plannedVsReported = {}
            let hoursData = {}
            let estimatedProgress = []

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

                plannedVsUnplannedWork = {
                    ran: Math.random(), // added random as animation and label were not working simultaneously, need to remove this as soon as bug with rechart is fixed
                    total: 100,
                    planned: planned,
                    unplanned: parseFloat((100 - planned).toFixed(2))
                }

                //plannedWork.push()

                // Actual Progress bar graph calculation (Pending + Completed)

                let sumProgressEstimatedHours = plannedIterations.reduce((sum, p) => {
                    return sum + p.estimatedHours * p.progress
                }, 0)

                let progress = sumProgressEstimatedHours / sumEstimatedHours
                progress = parseFloat(progress.toFixed(2))
                overallProgress = {
                    ran: Math.random(),
                    total: 100,
                    progress: progress,
                    remaining: parseFloat((100 - progress).toFixed(2))
                }

                //actualProgress.push()

                let sumEstimatedHoursCompletedTasks = plannedIterations.reduce((sum, p) => {
                    return sum + p.estimatedHoursCompletedTasks
                }, 0)

                let progressCompletedTasks = (sumEstimatedHoursCompletedTasks * 100) / sumEstimatedHours
                progressCompletedTasks = parseFloat(progressCompletedTasks.toFixed(2))
                let progressPendingTasks = parseFloat((progress - progressCompletedTasks).toFixed(2))

                completedPendingProgress = {
                    ran: Math.random(),
                    total: 100,
                    completed: progressCompletedTasks,
                    pending: progressPendingTasks,
                    remaining: parseFloat((100 - progress).toFixed(2))
                }

                //completedProgress.push()

                let sumReportedHours = plannedIterations.reduce((sum, p) => {
                    return sum + p.reportedHours
                }, 0)

                let sumPlannedHoursReportedTasks = plannedIterations.reduce((sum, p) => {
                    console.log("planned hours reported tasks is ", p.plannedHoursReportedTasks)
                    return sum + p.plannedHoursReportedTasks
                }, 0)


                plannedVsReported = {
                    ran: Math.random(),
                    base: sumPlannedHoursReportedTasks >= sumReportedHours ? sumReportedHours : sumPlannedHoursReportedTasks,
                    baseHour: sumPlannedHoursReportedTasks >= sumReportedHours ? 'reported' : 'planned',
                    extra: sumPlannedHoursReportedTasks >= sumReportedHours ? sumPlannedHoursReportedTasks - sumReportedHours : sumReportedHours - sumPlannedHoursReportedTasks
                }

                hoursData.plannedHours = sumPlannedHours
                hoursData.reportedHours = sumReportedHours
                hoursData.estimatedHours = sumEstimatedHours

            }

            return Object.assign({}, state, {
                plannedVsUnplannedWork,
                overallProgress,
                completedPendingProgress,
                plannedVsReported,
                hoursData
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