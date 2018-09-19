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
        tabSelected: (tab) => dispatch(A.releaseTabSelected(tab)),
        openUpdateReleaseDatesForm: (release) => {
            dispatch(initialize("update-release-dates", {
                _id: release._id
            }))
            dispatch(A.showComponent(COC.UPDATE_RELEASE_DATES_DIALOG))
        },
        openUpdateReleaseForm: (release) => {
            dispatch(A.getAllProjectsFromServer())
            dispatch(A.getAllModulesFromServer())
            dispatch(A.getUsersWithRoleCategoryFromServer())
            dispatch(A.getAllTechnologiesFromServer())
            dispatch(A.getAllDevelopmentTypesFromServer())

            dispatch(initialize("update-release", {
                _id: release._id,
                developmentType: release.developmentType,
                leader: release.leader,
                manager: release.manager,
                team: release.team
            }))
            dispatch(A.showComponent(COC.UPDATE_RELEASE_FORM_DIALOG))
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