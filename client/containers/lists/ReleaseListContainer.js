import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseStatus: (status) => dispatch(A.getAllReleasesFromServer(status)),
    releaseSelected: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))
            }
        })
        //dispatch(A.getReleasePlansFromServer(release._id, SC.ALL, SC.ALL))


    },
    showCreateReleaseDialog: () => {
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllModulesFromServer())
        dispatch(A.getUsersWithRoleCategoryFromServer())
        dispatch(A.getAllTechnologiesFromServer())
        dispatch(A.getAllDevelopmentTypesFromServer())
        dispatch(A.showComponent(COC.CREATE_RELEASE_FORM_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => ({
    releases: state.release.all
})

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer