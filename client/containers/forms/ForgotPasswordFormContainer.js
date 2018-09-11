import {connect} from 'react-redux'
import {ForgotPasswordForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formData) => {
        dispatch(A.forgotPasswordRequest(formData.email))
    },
})

const mapStateToProps = (state, ownProps) => ({
        errorMsg: state.user.forgotPasswordRequestInfo && state.user.forgotPasswordRequestInfo.status == false ? "Invalid Email Address" : null,
        forgotPasswordRequestInfo: state.user.forgotPasswordRequestInfo
})

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordFormContainer