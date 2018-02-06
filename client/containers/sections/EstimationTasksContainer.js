import {connect} from 'react-redux'
import {EstimationTasks} from "../../components"
import * as EC from '../../../server/errorcodes'
import {NotificationManager} from "react-notifications";
import * as A from "../../actions";

const mapStateToProps = (state, ownProps) => ({
    tasks: state.estimation.tasks,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})
const mapDispatchToProps = (dispatch, ownProps) => ({
    requestTaskEdit: (task) => {
        dispatch(A.requestForTaskEditPermissionOnServer(task._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Edit requested successfully")
            } else {
                if (json.code == EC.INVALID_OPERATION)
                    NotificationManager.error("Task Edit already requested")
                else
                    NotificationManager.error("Unknown error occurred")
            }
        })
    }
})

const EstimationTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTasks)

export default EstimationTasksContainer