import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleasePlanList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    releasePlanSelected: (releasePlan, role) => {
        dispatch(A.getReleasePlanDetailsFromServer(releasePlan._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_PLANNING_PAGE))
            }
        })
        dispatch(A.getAllTaskPlannedFromServer(releasePlan._id))
        if (role === SC.ROLE_MANAGER) {
            // get all developers from user list when user role in this release is manager
            dispatch(A.getAllDeveloperFromServer())
        } else if (role === SC.ROLE_LEADER) {
            // get project developers from user list when user role in this release is leader
            dispatch(A.getReleaseDevelopersFromServer(releasePlan._id))
        }
    },

    ReleaseProjectGoBack: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))
            }
        })
        dispatch(A.getAllReleasesFromServer("all"))

    },

    changeReleaseFlag: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag)),
    changeReleaseStatus: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag)),
    getAllWarnings: (release) => dispatch(A.getAllWarningsOfThisReleaseFromServer(release._id))
})

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    release: state.release.selectedRelease,
    releasePlans: state.release.releasePlans
})

const ReleasePlanListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanList))

export default ReleasePlanListContainer