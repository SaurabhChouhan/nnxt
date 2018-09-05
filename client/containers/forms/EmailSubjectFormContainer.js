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
            return dispatch(A.addEmailSubjectOnServer(values)).then((json) => {
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
    }
})

const mapStateToProps = (state, ownProps) => ({

})

const EmailSubjectFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailTypeForm)

export default EmailSubjectFormContainer