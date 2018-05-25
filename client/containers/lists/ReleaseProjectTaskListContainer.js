import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseProjectTaskList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'


const mapDispatchToProps = (dispatch, ownProps) => ({
    taskPlanSelected: (releasePlan) => {
        dispatch(A.getAllDeveloperFromServer()),
        dispatch(A.releaseTaskPlanSelected(releasePlan)),
            dispatch(A.addDeveloperFilteredData([])),
            dispatch(A.getAllTaskPlannedFromServer(releasePlan._id))
        dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_PLANNING_PAGE))
    },

    ReleaseProjectGoBack: () => {
        dispatch(A.getAllReleaseProjectsFromServer("all"))
        dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))
    },

    changeReleaseFlag: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag)),

    changeReleaseStatus: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag))
})

const mapStateToProps = (state) => {
    return {
        loggedInUser: state.user.loggedIn,
        selectedRelease: state.release.selectedProject,
        releasePlans: state.release.projectTasks
    }
}

const ReleaseProjectTaskListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseProjectTaskList))

export default ReleaseProjectTaskListContainer