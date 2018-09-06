import {connect} from 'react-redux'
import {EmailTypeForm} from "../../components"
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import * as A from "../../actions";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(A.addEmailTypesOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST))
                        NotificationManager.success('Email Type Added Successful');
                    } else {
                        NotificationManager.error('Email Type Added Failed');
                        if (json.code && json.code == EC.ALREADY_EXISTS) {
                            // type already exists throw SubmissionError to show appropriate error
                            throw new SubmissionError({email: 'Email Type already exists'})
                        }
                        throw new SubmissionError(json.errors)
                    }
                }
            )
        }
    },
    verifyTemplateType:(templateType) => dispatch(A.verifyTemplatesTypeFromServer(templateType))
})

const mapStateToProps = (state, ownProps) => ({
    templateType: state.form && state.form.emailType && state.form.emailType.values && state.form.emailType.values.name ? state.form.emailType.values.name : null,
    isEmailTemplateTypeExist: state.emailTemplate.isEmailTemplateTypeExist
})

const EmailTypeFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTypeForm)

export default EmailTypeFormContainer