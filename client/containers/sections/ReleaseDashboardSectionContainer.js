import {connect} from 'react-redux'
import {ReleaseDashboardSection} from "../../components"
import * as A from "../../actions";
import moment from 'moment'

const mapDispatchToprops = (dispatch, ownProps) => ({
    getDashboardData: (release) => {
        dispatch(A.getReleaseForDashboard(release._id)).then(() => {
            let m = moment()
            dispatch(A.getReleaseDayPlannings(release._id, m.month(), m.year()))
        })
    },
    getReleaseDailyPlannings: (releaseID, month, year) => {
        dispatch(A.getReleaseDayPlannings(releaseID, month, year))
    }
})

const mapStateToProps = (state, ownProps) => ({
    plannedVsUnplannedWork: state.dashboard.plannedVsUnplannedWork,
    overallProgress: state.dashboard.overallProgress,
    completedPendingProgress: state.dashboard.completedPendingProgress,
    plannedVsReported: state.dashboard.plannedVsReported,
    hoursData: state.dashboard.hoursData,
    estimatedProgress: state.dashboard.estimatedProgress,
    progress: state.dashboard.progress,
    unplannedReport: state.dashboard.unplannedReport,
    dailyPlannings: state.dashboard.dailyPlannings,
    selectedRelease: state.release.selectedRelease,
    resetDailyPlanningMonth: state.dashboard.resetDailyPlanningMonth,
    plannedMgmt: state.dashboard.plannedMgmt
})


const ReleaseDashboardSectionContainer = connect(
    mapStateToProps,
    mapDispatchToprops
)(ReleaseDashboardSection)

export default ReleaseDashboardSectionContainer