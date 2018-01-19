import {connect} from 'react-redux'
import {LoginForm} from "../../components"
import {loginUserOnServer} from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => dispatch(loginUserOnServer(values))
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