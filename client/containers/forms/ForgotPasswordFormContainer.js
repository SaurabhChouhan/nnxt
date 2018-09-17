import {connect} from 'react-redux'
import {ForgotPasswordForm} from "../../components"
import * as A from "../../actions"
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formData) => {
        if(formData.email && formData.otp && formData.password){
            dispatch(A.updateNewPasswordOnServer(formData)).then((json) => {
                if (json.success) {
                    NotificationManager.success('Password has been updated successfully')
                } else {
                    NotificationManager.error('Error in password updation or please enter OTP again!')
                }
            })
        }else{
            dispatch(A.forgotPasswordRequest(formData.email)).then((json) => {
                if (json.data) {
                    NotificationManager.success('OTP has been sent on email.')
                } else {
                    NotificationManager.error('Error in sending OTP!')
                }
            })
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