import { connect } from 'react-redux'
import { BillingTaskDescriptionForm } from "../../components"
import { BILLING_TASK_DESCRIPTION_DIALOG } from '../../components/componentConsts'
import { addBillingTaskDescriptionOnServer, hideComponent } from "../../actions"
import { change } from "redux-form";
import { NotificationManager } from "react-notifications";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (data) => {
        console.log("Billing data is ", data)
        dispatch(addBillingTaskDescriptionOnServer(data)).then((json) => {
            if (json.success) {
                NotificationManager.success('Billing description saved...')
                dispatch(change('billing-task-form-' + json.data._id, 'description', json.data.description))
                dispatch(hideComponent(BILLING_TASK_DESCRIPTION_DIALOG))
            } else
                NotificationManager.error(json.message)
            return json
        })

    }
})

const BillingTaskDescriptionFormContainer = connect(
    null,
    mapDispatchToProps
)(BillingTaskDescriptionForm)

export default BillingTaskDescriptionFormContainer