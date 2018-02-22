import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseStatus: (status) => {
        if (status)
            return dispatch(A.getAllReleaseFromServer(status))
    },
    projectSelected: (release) => {
        dispatch(A.releaseProjectSelected(release))
        dispatch(A.getTaskReleaseFromServer(release, "all", "all"))
        dispatch(A.showComponentHideOthers(COC.RELEASE_DETAIL_LIST))


    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        releases: state.release.all


    }
}

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer