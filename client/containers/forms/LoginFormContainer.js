import {connect} from 'react-redux'
import {LoginForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => dispatch(A.loginUserOnServer(values)).then(json => {
        if (json.success) {
            dispatch(A.getTodayNotifications())
        }
    })
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