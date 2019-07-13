import {connect} from 'react-redux'
import {BillingTaskDescriptionForm} from "../../components"
import * as A from "../../actions"
import {formValueSelector, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (reportData) => {

        /*
        console.log("billing task description ", reportData)

        dispatch(A.reportTaskToServer(reportData)).then((json) => {
            if (json.success) {
                NotificationManager.success('Task report submitted.')
                dispatch(A.taskReported(json.data.taskPlan))
                dispatch(A.hideComponent(COC.REPORT_TASK_DESCRIPTION_DIALOG))
            } else
                NotificationManager.error(json.message)
            return json
        })
        */
    }
})

const BillingTaskDescriptionFormContainer = connect(
    null,
    mapDispatchToProps
)(BillingTaskDescriptionForm)

export default BillingTaskDescriptionFormContainer