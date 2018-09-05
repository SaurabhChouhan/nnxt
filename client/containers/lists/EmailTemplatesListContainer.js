import {connect} from 'react-redux'
import {EmailTemplateList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showEmailTemplateForm: () => dispatch(A.showComponentHideOthers(COC.EMAIL_TEMPLATE_FORM))
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        users: state.user.all
    }
}

const EmailTemplatesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTemplateList)

export default EmailTemplatesListContainer