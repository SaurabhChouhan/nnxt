import {connect} from 'react-redux'
import {LoginForm} from "../../components"
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

const LoginFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm)

export default LoginFormContainer