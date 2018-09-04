import {connect} from 'react-redux'
import {TaskPlanDateNavBar} from "../../components/index"
import * as A from '../../actions/index'
import moment from 'moment'

const mapDispatchToProps = (dispatch, ownProps) => ({

    onSubmit: (values) => {
        console.log("get the values of on submit TaskPlanDateNavBarContainer", values),
            dispatch(A.getSearchTaskPlanResultFromServer(values))

    }
})

const mapStateToProps = (state, ownProps) => ({

    initialValues: {
        "releaseID": state.release.selectedRelease._id,
    }
})

const TaskPlanDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanDateNavBar)

export default TaskPlanDateNavBarContainer