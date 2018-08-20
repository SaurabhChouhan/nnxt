import {connect} from 'react-redux'
import * as A from '../../actions/index'
import {ReleasePlanSection} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {initialize} from 'redux-form'
import * as U from "../../../server/utils";
import moment from "moment/moment";

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
        tabSelected: (tab) => dispatch(A.releaseTabSelected(tab)),
        openUpdateReleaseDatesForm: (release) => {

            const devStartDate = moment(release.devStartDate).format(SC.DATE_FORMAT)
            const devEndDate = moment(release.devEndDate).format(SC.DATE_FORMAT)
            const clientReleaseDate = moment(release.clientReleaseDate).format(SC.DATE_FORMAT)


            let iterations = release.iterations.filter(i => i.type === SC.ITERATION_TYPE_ESTIMATED)

            dispatch(initialize("update-release-dates", {
                _id: release._id
            }))
            dispatch(A.showComponent(COC.UPDATE_RELEASE_DATES_DIALOG))
        }
    }
)

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