import { connect } from 'react-redux'
import { ClientForm } from "../../components"
import * as logger from '../../clientLogger'
import * as A from "../../actions"
import { addClientOnServer, editClientOnServer } from "../../actions"
import { SubmissionError } from "redux-form";
import * as EC from "../../../server/errorcodes";
import { NotificationManager } from "react-notifications";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            logger.debug(logger.CLIENT_FORM_CONNECT, "onSubmit:values:", values)
            return dispatch(addClientOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success('Client Added Successfully')
                    dispatch(A.hideComponent(COC.CLIENT_FORM_DIALOG))

                } else {
                    NotificationManager.error('Client Not Added!')
                    if (json.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({ name: "Client Already Exists" })
                }
                return json
            })
        } else {
            return dispatch(editClientOnServer(values)).then(response => {
                if (response.success) {
                    dispatch(A.hideComponent(COC.CLIENT_FORM_DIALOG)),
                        NotificationManager.success('Client Updated Successfully')
                } else {
                    NotificationManager.error('Client Updated Failed');
                    if (response.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({ name: response.message })
                }
                return json
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn
})

const ClientFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientForm)

export default ClientFormContainer