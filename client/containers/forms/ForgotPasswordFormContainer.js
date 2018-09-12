import {connect} from 'react-redux'
import {ForgotPasswordForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formData) => {
        if(formData.email && formData.otp && formData.password){
            dispatch(A.updateNewPasswordOnServer(formData))
        }else{
            dispatch(A.forgotPasswordRequest(formData.email))
        }
    },
})

const mapStateToProps = (state, ownProps) => ({
        errorMsg: state.user.forgotPasswordRequestInfo && state.user.forgotPasswordRequestInfo.forgotPasswordRequestStatus == false ? "Invalid Email Address" : null,
        forgotPasswordRequestInfo: state.user.forgotPasswordRequestInfo
})

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordFormContainer