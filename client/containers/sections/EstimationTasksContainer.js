import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"
import * as EC from '../../../server/errorcodes'
import {NotificationManager} from "react-notifications";
import * as A from "../../actions";
import {initialize} from 'redux-form'
import * as COC from "../../components/componentConsts";
import * as SC from "../../../server/serverconstants"

const mapDispatchToProps = (dispatch, ownProps) => ({

    requestTaskEdit: (values) => {
        let task = {}
        task.task_id = values._id
        return dispatch(A.requestForTaskEditPermissionOnServer(task)).then(json => {
            if (json.success) {

                if (json.data && json.data.estimator && json.data.estimator.changeRequested)
                    NotificationManager.success("Edit request on Task raised...")
                else
                    NotificationManager.success("Edit request on Task cleared...")
            } else {
                NotificationManager.error("Unknown error occurred")
            }
        })
    },

    deleteTask: (values) => {
        return dispatch(A.deleteEstimationTaskOnServer(values.estimation._id, values._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Deleted successfully")
            }
            else
                NotificationManager.error("Task Deletion Failed !")

        })
    },

    requestDeleteTask: (values) => {
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

    editTask: (values, loggedInUserRole) => {
        dispatch(A.showComponent(COC.ESTIMATION_TASK_DIALOG))
        let task = {}
        task._id = values._id
        task.estimation = values.estimation
        if (loggedInUserRole != SC.ROLE_NEGOTIATOR) {
            task.name = values.estimator.name
            task.description = values.estimator.description
            task.estimatedHours = values.estimator.estimatedHours
        }
        else {
            task.name = values.negotiator.name
            task.description = values.negotiator.description
            task.estimatedHours = values.negotiator.estimatedHours
        }
        task.feature = values.feature
        task.technologies = values.technologies
        dispatch(initialize("estimation-task", task))
    },

    showFeatureSelectionForm: (values) => {

        let task = {}
        task.task_id = values._id
        dispatch(A.showComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
        dispatch(initialize("MoveTaskInFeatureForm", task))
    },
    moveTaskOutOfFeature: (values) => {
        let task = {}
        task.task_id = values._id
        task.feature_id = values.feature._id

        return dispatch(A.moveTaskOutOfFeatureOnServer(values))
        dispatch(initialize("MoveTaskInFeatureForm", task))


    },
    suggestTask: (values) => console.log("suggestion Form",values),
    grantedEditTask: (values) => console.log("grantedEditTask ",values),
    heRequestedEditTask: (values) => console.log("heRequestedEditTask ",values),
    suggestionOutgoingTask: (values) => console.log("suggestionOutgoingTask ",values),
    heRequestedDeleteTask: (values) => console.log("heRequestedDeleteTask ",values),
    suggestionIncomingTask: (values) => console.log("suggestionIncomingTask ",values),
    requestedDeleteTask: (values) => console.log("requestedDeleteTask ",values),
    heGrantedEditTask: (values) => console.log("heGrantedEditTask ",values)

})


const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks
})


const EstimationTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTasks)

export default EstimationTasksContainer