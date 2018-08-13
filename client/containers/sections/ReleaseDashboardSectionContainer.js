import {connect} from 'react-redux'
import {ReleaseDashboardSection} from "../../components"


const mapStateToProps = (state, ownProps) => ({
    plannedVsUnplannedWork: state.dashboard.plannedVsUnplannedWork,
    overallProgress: state.dashboard.overallProgress,
    completedPendingProgress: state.dashboard.completedPendingProgress,
    plannedVsReported: state.dashboard.plannedVsReported,
    hoursData: state.dashboard.hoursData,
    estimatedProgress: state.dashboard.estimatedProgress
})


const ReleaseDashboardSectionContainer = connect(
    mapStateToProps,
    null
)(ReleaseDashboardSection)

export default ReleaseDashboardSectionContainer