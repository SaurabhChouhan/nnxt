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
    plannedWork: state.dashboard.plannedWork,
    actualProgress: state.dashboard.actualProgress
})


const DashboardSectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardSection)

export default DashboardSectionContainer