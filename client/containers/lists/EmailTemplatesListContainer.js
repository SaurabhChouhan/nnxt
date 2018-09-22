import {connect} from 'react-redux'
import {EmailTemplateList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editEmailTemplate: (template) => {
        dispatch(A.saveEditTemplateInfo(template))
            dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_FORM)),
            dispatch(initialize('emailTemplate', template))
    },
    deleteEmailTemplate: (templateID) => dispatch(A.deleteEmailTemplateFromServer(templateID)).then(json => {
        if (json.success) {
            dispatch(A.getAllEmailTemplatesFromServer())
            NotificationManager.success('Email Template Deleted Successfully')
        } else {
            NotificationManager.error('Email Template Not Deleted!')
        }
    }),
    emailTemplateApproveFLag: (template) => {
        dispatch(A.approveTemplate(template)).then(json => {
            if (json.success) {
                dispatch(A.getAllEmailTemplatesFromServer())
            }
        })
    },
    showEmailTemplateForm: () => {
        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_FORM))
        dispatch(A.getAllEmailTemplatesTypesFromServer())
    },
    getTemplateOnChange: (type) => {
        dispatch(A.getAllEmailTemplatesFromServer(type))
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        emailTemplates: state.emailTemplate.allEmailTemplates,
        editTemplateInfo: state.emailTemplate && state.emailTemplate.editTemplateInfo ? state.emailTemplate.editTemplateInfo : null,
        allEmailTemplatesTypes: state.emailTemplate.allEmailTemplatesTypes,
    }
}

const EmailTemplatesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTemplateList)

export default EmailTemplatesListContainer