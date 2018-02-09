import {connect} from 'react-redux'
import {EstimationSuggestTaskForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from "../../../server/serverconstants"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if(values._id){
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.updateTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Task Suggested")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Task Updated")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                } else {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.error("Task Suggestion Failed")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.error("Task Updation Failed")
                }
            })
        }
        else{
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
    estimation: state.estimation.selected,
    features:state.estimation.features
})

const EstimationSuggestTaskFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSuggestTaskForm)

export default EstimationSuggestTaskFormContainer