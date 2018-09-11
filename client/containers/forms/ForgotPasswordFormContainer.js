import {connect} from 'react-redux'
import {ForgotPasswordForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => dispatch(A.loginUserOnServer(values)),
})

const mapStateToProps = (state, ownProps) => {
    return {
        errorMsg: state.user.loginError
    }
}

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordFormContainer