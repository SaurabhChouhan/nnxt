import {connect} from 'react-redux'
import {EstimationTaskForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if(values._id){
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.updateTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Task Updated")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_TASK_DIALOG))
                } else {
                    NotificationManager.error("Task Updation Failed")
                }
            })
        }
        else{
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
            dispatch(A.addTaskToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Task Added")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_TASK_DIALOG))
                } else {
                    NotificationManager.error("Task Addition Failed")
                }
            })
        }

    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected
})

const EstimationTaskFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTaskForm)

export default EstimationTaskFormContainer