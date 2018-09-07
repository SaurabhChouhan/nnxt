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
                        dispatch(A.getAllEmailTemplatesFromServer())
                        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST))
                        NotificationManager.success('Email Template Added Successful');
                    } else {
                        NotificationManager.error('Email Template Added Failed')
                    }
                }
            )
        }
        else {
            return dispatch(A.updateEmailTemplateOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(A.getAllEmailTemplatesFromServer())
                        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST))
                        NotificationManager.success('Email Template Updated Successful');
                    } else {
                        NotificationManager.error('Email Template Updated Failed')
                    }
                }
            )

        }
    },
    showEmailTemplateList: () => dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_LIST)),
    verifyTemplateName:(templateName) => dispatch(A.verifyTemplatesNameFromServer(templateName))
})

const mapStateToProps = (state, ownProps) => ({
    allEmailTemplatesTypes: state.emailTemplate.allEmailTemplatesTypes,
    templateName: state.form && state.form.emailTemplate && state.form.emailTemplate.values && state.form.emailTemplate.values.templateName ? state.form.emailTemplate.values.templateName : null,
    isEmailTemplateNameExist: state.emailTemplate.isEmailTemplateNameExist
})

const EmailTemplateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTemplateForm)

export default EmailTemplateFormContainer