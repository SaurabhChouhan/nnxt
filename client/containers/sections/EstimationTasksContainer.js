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
        let task={}
        task.task_id=values._id
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("MoveTaskInFeatureForm", task))
    },
    moveTaskOutOfFeature: (values) => {
        console.log("view the value at moveTaskOutOfFeature",values)
        let task={}
        task.task_id=values._id
        task.feature_id=values.feature._id

        console.log("view the task at moveTaskOutOfFeature",task)
        return dispatch(A.moveTaskOutOfFeatureOnServer(values))
        //dispatch(initialize("MoveTaskInFeatureForm", task))
    }
})

const EstimationTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTasks)

export default EstimationTasksContainer