import {connect} from 'react-redux'
import {EmailTemplateForm} from "../../components"
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import * as A from "../../actions";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(A.addEmailTemplateOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST))
                        NotificationManager.success('Email Template Added Successful');
                    } else {
                        NotificationManager.error('Email Template Added Failed');
                        if (json.code && json.code == EC.ALREADY_EXISTS) {
                            // role already exists throw SubmissionError to show appropriate error
                            throw new SubmissionError({email: 'Email Template already exists'})
                        }
                        throw new SubmissionError(json.errors)
                    }
                }
            )
        }
    },
    showEmailTemplateList: () => dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST))
})

const mapStateToProps = (state, ownProps) => ({
    roles: state.emailTemplate.allSubjects

    // roles:state.users.roles
})

const EmailTemplateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTemplateForm)

export default EmailTemplateFormContainer