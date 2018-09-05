import {connect} from 'react-redux'
import {TaskPlanDateNavBar} from "../../components/index"
import * as A from '../../actions/index'
import moment from 'moment'

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchTasks: (values) => {
        dispatch(A.getSearchTaskPlanResultFromServer(values))
    }
})

const mapStateToProps = (state) => ({
    initialValues: {
        "releaseID": state.release.selectedRelease._id,
    },
    devStartDate: state.release.selectedRelease.devStartDate,
    devEndDate: state.release.selectedRelease.devEndDate,
    releaseID: state.release.selectedRelease._id
})

const TaskPlanDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanDateNavBar)

export default TaskPlanDateNavBarContainer