import {connect} from 'react-redux'
import * as A from '../../actions'
import {ReleaseProjectTaskList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'


const mapDispatchToProps = (dispatch, ownProps) => ({
    taskPlanSelected: (taskPlanning) => {
        dispatch(A.releaseTaskPlanSelected(taskPlanning)),
            dispatch(A.addDeveloperFilteredData([])),
            dispatch(A.getAllTaskPlannedFromServer(taskPlanning.task._id))
        dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_DETAIL_PAGE))
    },
    ReleaseProjectGoBack: (event) => dispatch(A.showComponentHideOthers(COC.RELEASE_LIST)),

    changeReleaseFlag: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag)),

    changeReleaseStatus: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag))
})

const mapStateToProps = (state) => {
    return {
        loggedInUser: state.user.loggedIn,
        selectedProject: state.release.selectedProject,
        projectTasks: state.release.projectTasks
    }
}

const ReleaseProjectTaskListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseProjectTaskList))

export default ReleaseProjectTaskListContainer