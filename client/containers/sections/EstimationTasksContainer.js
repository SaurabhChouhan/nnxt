import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"
import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {initialize} from "redux-form"

const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})
const mapDispatchToProps = (dispatch, ownProps) => ({
    showFeatureSelectionForm: (values) => {
        let task={
            "task":{
                "_id":""
            }
        }
        task.task._id=values
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("MoveTaskInFeatureForm", task))
    }
})

const EstimationTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTasks)

export default EstimationTasksContainer