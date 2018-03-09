import {connect} from 'react-redux'
import {EstimationSuggestTaskForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from "../../../server/serverconstants"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (values._id) {
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.updateTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Added task suggestion")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Updated task")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                } else {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.error("Suggestions not saved")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.error("Task updates failed")
                }
            })
        }
        else {
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.addTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Task Suggested")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Task Added")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                } else {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.error("Update Task Suggestion Failed")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.error("Task Addition Failed")
                }
            })
        }

    }
})

const mapStateToProps = (state, ownProps) => ({
})

const EstimationSuggestTaskFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSuggestTaskForm)

export default EstimationSuggestTaskFormContainer