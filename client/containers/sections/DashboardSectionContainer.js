import {connect} from 'react-redux'
import {DashboardSection} from "../../components"
import * as A from "../../actions";


const mapDispatchToProps = (dispatch, ownProps) => ({
        setReleaseID: (releaseID) => {
            dispatch(A.setReleaseID(releaseID))
            dispatch(A.getReleaseForDashboard(releaseID))
        }
    }
)

const mapStateToProps = (state, ownProps) => ({
    allReleases: state.dashboard.allReleases,
    selectedReleaseID: state.dashboard.selectedReleaseID,
    plannedVsUnplannedWork: state.dashboard.plannedVsUnplannedWork,
    overallProgress: state.dashboard.overallProgress,
    completedPendingProgress: state.dashboard.completedPendingProgress,
    plannedVsReported: state.dashboard.plannedVsReported,
    hoursData: state.dashboard.hoursData
})


const DashboardSectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardSection)

export default DashboardSectionContainer