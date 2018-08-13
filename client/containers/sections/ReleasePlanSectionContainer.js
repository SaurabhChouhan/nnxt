import {connect} from 'react-redux'
import * as A from '../../actions/index'
import {ReleasePlanSection} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {initialize} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReleaseProjectGoBack: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))
            }
        })
        dispatch(A.getAllReleasesFromServer(SC.ALL))

    },
    getDashboardData: (release) => dispatch(A.getReleaseForDashboard(release._id)),
    getAllReleasePlans: (release) => dispatch(A.getReleasePlansFromServer(release._id, SC.ALL, SC.ALL)),
    getAllWarnings: (release) => dispatch(A.getAllWarningsOfThisReleaseFromServer(SC.ALL, release._id)),
    getAllTaskPlans: (release) => dispatch(A.getAllTaskPlansOfThisReleaseFromServer(release._id)),
    getAllTaskReports: (release) => {
        return dispatch(A.getAllTaskReportsOfThisReleaseFromServer(release._id))
    },
    tabSelected: (tab) => dispatch(A.releaseTabSelected(tab)),
    openUpdateReleaseDatesForm: (release) => {
        dispatch(initialize("update-release-dates", release.iterations[0]))
        dispatch(A.showComponent(COC.UPDATE_RELEASE_DATES_DIALOG))

    },
})

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    release: state.release.selectedRelease,
    selectedTab: state.release.selectedTab
})

const ReleasePlanSectionContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanSection))

export default ReleasePlanSectionContainer