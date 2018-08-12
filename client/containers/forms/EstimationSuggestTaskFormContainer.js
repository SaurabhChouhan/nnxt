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
                    NotificationManager.success("Suggestions saved successfully")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                } else {
                    NotificationManager.error(json.message)
                }
            })
        }
        else {
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.addTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Task suggestions saved successfully")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Task estimations saved successfully")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                } else {
                    NotificationManager.error(json.message)
                }
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected
})

const EstimationSuggestTaskFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSuggestTaskForm)

export default EstimationSuggestTaskFormContainer