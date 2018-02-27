import {connect} from 'react-redux'
import {ReleaseTaskDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showTaskPlanningCreationForm: () => {

        dispatch(A.showComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
    },
    showPlanTask: (release) => dispatch(A.getTaskDetailReleaseFromServer(release))


})


const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    //release: state.release.selectedTask,
    task:state.release.selectedTask,
    taskPlanning : [],
    data : []
})

const ReleaseTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskDetailPage)

export default ReleaseTaskDetailPageContainer
