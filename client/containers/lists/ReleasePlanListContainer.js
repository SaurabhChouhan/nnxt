import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleasePlanList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    releasePlanSelected: (releasePlan, roles) => {
        dispatch(A.getReleasePlanDetailsFromServer(releasePlan._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_PLANNING_PAGE))
            }
        })
        dispatch(A.getAllTaskPlannedFromServer(releasePlan._id))
        if (roles.indexOf(SC.ROLE_MANAGER) > -1) {
            // get all developers from user list when user role in this release is manager
            dispatch(A.getAllDeveloperFromServer())
        } else if (roles.indexOf(SC.ROLE_LEADER) > -1) {
            // get project developers from user list when user role in this release is leader
            dispatch(A.getReleaseDevelopersFromServer(releasePlan._id))
        }
    },

    changeReleaseFlag: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag)),
    changeReleaseStatus: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag))
})

const mapStateToProps = (state) => ({
    release: state.release.selectedRelease,
    releasePlans: state.release.releasePlans
})

const ReleasePlanListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanList))

export default ReleasePlanListContainer