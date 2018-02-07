import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"
import * as EC from '../../../server/errorcodes'
import {NotificationManager} from "react-notifications";
import * as A from "../../actions";
import * as COC from '../../components/componentConsts'
import {initialize, SubmissionError} from 'redux-form'


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
        dispatch(A.showComponentHideOthers(COC.ESTIMATION_TASK_DIALOG)),
            dispatch(initialize("estimation-task", values))

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