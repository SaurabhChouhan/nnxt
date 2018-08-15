import {connect} from 'react-redux'
import * as A from '../../actions'
import {TaskPlanList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getAllTaskPlans: (release) => dispatch(A.getAllTaskPlansOfThisReleaseFromServer(release._id))
})

const mapStateToProps = (state) => ({
    taskPlans: state.release.taskPlans
})

const TaskPlanListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanList))

export default TaskPlanListContainer