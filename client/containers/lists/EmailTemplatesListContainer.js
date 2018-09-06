import {connect} from 'react-redux'
import {EmailTemplateList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showEmailTemplateForm: () => {
        dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_FORM))
        dispatch(A.getAllEmailTemplatesTypesFromServer())
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        emailTemplates: state.emailTemplate.allEmailTemplates
    }
}

const EmailTemplatesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTemplateList)

export default EmailTemplatesListContainer