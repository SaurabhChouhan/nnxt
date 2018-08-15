import * as AC from '../actions/actionConsts'
import * as SC from '../../server/serverconstants'

let initialState = {
    plannedVsUnplannedWork: {},
    overallProgress: {},
    completedPendingProgress: {},
    plannedVsReported: {},
    hoursData: {},
    estimatedProgress: {},
    progress: {}
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.CALCULATE_RELEASE_STATS:

            let plannedVsUnplannedWork = {}
            let overallProgress = {}
            let completedPendingProgress = {}
            let plannedVsReported = {}
            let hoursData = {}
            let estimatedProgress = {}
            let progress = {}

            let release = Object.assign({}, action.release)

            // To calculate percentage of planned work we need to iterate on all iterations of type 'planned' and then
            // sum all plannedHoursEstimatedTasks and then compare them against sum of all estimated hours
            let plannedIterations = release.iterations.filter(i => i.type == SC.ITERATION_TYPE_PLANNED || i.type == SC.ITERATION_TYPE_ESTIMATED)

            if (plannedIterations && plannedIterations.length) {

                let s = {
                    sumPlannedHours: 0,
                    sumEstimatedHours: 0,
                    sumReportedHours: 0,
                    sumEstimatedHoursCompletedTasks: 0,
                    sumPlannedHoursReportedTasks: 0,
                    sumProgressEstimatedHours: 0,
                    sumPlannedHoursEstimatedTasks: 0
                }

                plannedIterations.forEach(p => {
                    s.sumPlannedHours += p.plannedHours
                    s.sumEstimatedHours += p.estimatedHours
                    s.sumReportedHours += p.reportedHours
                    s.sumEstimatedHoursCompletedTasks += p.estimatedHoursCompletedTasks
                    s.sumPlannedHoursReportedTasks += p.plannedHoursReportedTasks
                    s.sumProgressEstimatedHours += p.estimatedHours * p.progress
                    s.sumPlannedHoursEstimatedTasks += p.plannedHoursEstimatedTasks
                })

                /**
                 * Overall progress
                 */

                let prg = s.sumProgressEstimatedHours / s.sumEstimatedHours
                prg = parseFloat(prg.toFixed(2))

                progress['actual'] = prg
                overallProgress = {
                    ran: Math.random(),
                    total: 100,
                    progress: prg,
                    remaining: parseFloat((100 - prg).toFixed(2))
                }

                /**
                 * Progress Completed/Pending tasks
                 */

                let progressCompletedTasks = (s.sumEstimatedHoursCompletedTasks * 100) / s.sumEstimatedHours
                progressCompletedTasks = parseFloat(progressCompletedTasks.toFixed(2))
                let progressPendingTasks = parseFloat((prg - progressCompletedTasks).toFixed(2))

                completedPendingProgress = {
                    ran: Math.random(),
                    total: 100,
                    completed: progressCompletedTasks,
                    pending: progressPendingTasks,
                    remaining: parseFloat((100 - prg).toFixed(2))
                }

                /**
                 * Estimated progress as per reporting
                 */

                let estimatedProgressReporting = parseFloat(((s.sumReportedHours * 100) / s.sumEstimatedHours).toFixed(2))
                let estimatedProgressPlanning = parseFloat(((s.sumPlannedHoursReportedTasks * 100) / s.sumEstimatedHours).toFixed(2))

                estimatedProgress = {
                    ran: Math.random(),
                    reported: estimatedProgressReporting,
                    planned: estimatedProgressPlanning,
                    remainingReported: parseFloat((100 - estimatedProgressReporting).toFixed(2)),
                    remainingPlanned: parseFloat((100 - estimatedProgressPlanning).toFixed(2))
                }

                progress['reported'] = estimatedProgressReporting
                progress['planned'] = estimatedProgressPlanning

                /**
                 * Planned Vs Unplanned work calculation
                 */

                let planned = parseFloat(((s.sumPlannedHoursEstimatedTasks * 100) / s.sumEstimatedHours).toFixed(2))
                plannedVsUnplannedWork = {
                    ran: Math.random(), // added random as animation and label were not working simultaneously, need to remove this as soon as bug with rechart is fixed
                    total: 100,
                    planned: planned,
                    unplanned: parseFloat((100 - planned).toFixed(2))
                }


                /**
                 * Planned v/s Reported Bar graph calculations
                 */

                plannedVsReported = {
                    ran: Math.random(),
                    base: s.sumPlannedHoursReportedTasks >= s.sumReportedHours ? s.sumReportedHours : s.sumPlannedHoursReportedTasks,
                    baseHour: s.sumPlannedHoursReportedTasks >= s.sumReportedHours ? 'reported' : 'planned',
                    extra: s.sumPlannedHoursReportedTasks >= s.sumReportedHours ? s.sumPlannedHoursReportedTasks - s.sumReportedHours : s.sumReportedHours - s.sumPlannedHoursReportedTasks
                }

                /**
                 * Hours comparison pie chart data
                 */

                hoursData.plannedHours = s.sumPlannedHours
                hoursData.reportedHours = s.sumReportedHours
                hoursData.estimatedHours = s.sumEstimatedHours
            }

            return Object.assign({}, state, {
                plannedVsUnplannedWork,
                overallProgress,
                completedPendingProgress,
                plannedVsReported,
                hoursData,
                estimatedProgress,
                progress: progress
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