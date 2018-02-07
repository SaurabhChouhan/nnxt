import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"
import * as EC from '../../../server/errorcodes'
import {NotificationManager} from "react-notifications";
import * as A from "../../actions";
<<<<<<< HEAD
import * as COC from '../../components/componentConsts'
import {initialize, SubmissionError} from 'redux-form'
=======
import * as COC from "../../components/componentConsts";
import {initialize} from "redux-form"
>>>>>>> master


const mapDispatchToProps = (dispatch, ownProps) => ({
    requestTaskEdit: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.requestForTaskEditPermissionOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Edit requested successfully")
            } else {
                if (json.code == EC.INVALID_OPERATION)
                    NotificationManager.error("Task Edit already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },
<<<<<<< HEAD
    deleteTask: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.deleteTaskOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Deleted successfully")
            }
            else
                NotificationManager.error("Task Deletion Failed !")

        })
    },
    deleteTaskRequest: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.requestForTaskDeletePermissionOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Delete requested successfully")
            } else {
                if (json.code == EC.INVALID_OPERATION)
                    NotificationManager.error("Task Delete already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    },
    editTask: (values) => {
        dispatch(A.showComponent(COC.ESTIMATION_TASK_DIALOG))
            let task={}
            task._id=values._id
            task.estimation=values.estimation
            task.name=values.estimator.name
            task.description=values.estimator.description
            task.estimatedHours=values.estimator.estimatedHours
            task.feature=values.feature
            task.technologies=values.technologies
            dispatch(initialize("estimation-task", task))

=======
    showFeatureSelectionForm: (values) => {
        let task = {
            "task": {
                "_id": ""
            }
        }
        task.task._id = values
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("MoveTaskInFeatureForm", task))
>>>>>>> master
    }

})


const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})


const EstimationTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTasks)

export default EstimationTasksContainer