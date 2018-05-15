import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseList} from "../../components"
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeReleaseStatus: (status) => dispatch(A.getAllReleaseProjectsFromServer(status)),
    projectSelected: (release) => {
        dispatch(A.releaseProjectSelected(release))
        dispatch(A.getTaskReleaseFromServer(release, "all", "all"))
        dispatch(A.showComponentHideOthers(COC.RELEASE_PROJECT_TASK_LIST))
    }
})

const mapStateToProps = (state, ownProps) => ({
    projects: state.release.all
})

const ReleaseListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseList)

export default ReleaseListContainer