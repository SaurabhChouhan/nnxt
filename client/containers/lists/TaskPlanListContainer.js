import {connect} from 'react-redux'
import * as A from '../../actions'
import {TaskPlanList} from "../../components"
import {withRouter} from 'react-router-dom'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getAllTaskPlans: (release) => dispatch(A.getAllTaskPlansOfThisReleaseFromServer(release._id))
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