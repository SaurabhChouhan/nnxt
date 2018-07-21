import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleasePlanList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {initialize} from 'redux-form'

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

    changeReleaseFlag: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag)),
    changeReleaseStatus: (release, status, flag) => dispatch(A.getReleasePlansFromServer(release._id, status, flag)),
    showAddToReleasePlanForm: (release) => {
        dispatch(A.showComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
        // initialize
        dispatch(initialize('release-plan-add-to-release', {
            release: {
                _id: release._id
            }
        }))
    },
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