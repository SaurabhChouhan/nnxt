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
    allReleases: state.app.allReleases,
    selectedReleaseID: state.app.selectedReleaseID,
    plannedWork: state.dashboard.plannedWork
})


const DashboardSectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardSection)

export default DashboardSectionContainer