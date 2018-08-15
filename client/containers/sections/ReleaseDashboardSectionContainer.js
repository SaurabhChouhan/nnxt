import {connect} from 'react-redux'
import {ReleaseDashboardSection} from "../../components"
import * as A from "../../actions";

const mapDispatchToprops = (dispatch, ownProps) => ({
    getDashboardData: (release) => dispatch(A.getReleaseForDashboard(release._id))
})

const mapStateToProps = (state, ownProps) => ({
    plannedVsUnplannedWork: state.dashboard.plannedVsUnplannedWork,
    overallProgress: state.dashboard.overallProgress,
    completedPendingProgress: state.dashboard.completedPendingProgress,
    plannedVsReported: state.dashboard.plannedVsReported,
    hoursData: state.dashboard.hoursData,
    estimatedProgress: state.dashboard.estimatedProgress,
    progress: state.dashboard.progress
})


const ReleaseDashboardSectionContainer = connect(
    mapStateToProps,
    mapDispatchToprops
)(ReleaseDashboardSection)

export default ReleaseDashboardSectionContainer