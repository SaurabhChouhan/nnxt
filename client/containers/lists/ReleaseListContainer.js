import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    search: (criteria) => {
        dispatch(A.searchReleaseFromServer(criteria))
        dispatch(A.getUsersWithRoleCategoryFromServer())
    },
    changeReleaseStatus: (status, flag) => dispatch(A.getAllReleasesFromServer(status, flag)),
    showAllReleasesChanged: (status, flag) => dispatch(A.getAllReleasesFromServer(status, flag)),
    releaseSelected: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_SECTION))
            }
        })
    },
    showCreateReleaseDialog: () => {
        dispatch(A.getAllClientsFromServer())
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllModulesFromServer())
        dispatch(A.getUsersWithRoleCategoryFromServer())
        dispatch(A.getAllTechnologiesFromServer())
        dispatch(A.getAllDevelopmentTypesFromServer())
        dispatch(A.showComponent(COC.CREATE_RELEASE_FORM_DIALOG))
    },
    fetchReleases: (value) => {
        console.log("fetch releases result values at container", value)
        dispatch(A.searchReleaseFromServer(value))
    }
})

const mapStateToProps = (state, ownProps) => {
    // If user has role Manager or top management he would get selected by default in release list

    let childProps = {
        releases: state.release.all,
        leaders: state.user.userWithRoleCategory && state.user.userWithRoleCategory.leaders ? state.user.userWithRoleCategory.leaders : [],
        managers: state.user.userWithRoleCategory && state.user.userWithRoleCategory.managers ? state.user.userWithRoleCategory.managers : [],
        releaseFilters: state.release.releaseFilters
    }

    let initialValues = undefined
    if (!state.release.releaseFilters.updated) {
        initialValues = {
            showActive: true
        }
        if (state.user.loggedIn && (state.user.loggedIn.roleNames.indexOf(SC.ROLE_MANAGER) > -1 || state.user.loggedIn.roleNames.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1)) {
            initialValues.manager = state.user.loggedIn._id
        }
        childProps['initialValues'] = initialValues
        childProps.releaseFilters = initialValues
    } else {
        childProps.initialValues = childProps.releaseFilters
    }

    return childProps
}

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer