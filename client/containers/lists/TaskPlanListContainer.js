import {connect} from 'react-redux'
import * as A from '../../actions'
import {TaskPlanList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    taskPlanSelectedForRelease: (taskPlan) => dispatch(A.getDataForReportTaskDetailPageFromServer(taskPlan._id)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.TASK_PLAN_DETAIL_PAGE))
    },
    getAllTaskPlans: (release) => dispatch(A.getAllTaskPlansOfThisReleaseFromServer(release._id)),
    onCopy: () => {
        console.log("container->onCopy() called")
        NotificationManager.success('Day requirement description Copied')
    }
})

const mapStateToProps = (state) => ({
    taskPlans: state.release.taskPlans,
    expandDescription: state.release.expandDescriptionTaskList,
    screenWidth: state.app.screenWidth,
    screenHeight: state.app.screenHeight
})

const TaskPlanListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanList))

export default TaskPlanListContainer