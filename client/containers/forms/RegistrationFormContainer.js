import {connect} from 'react-redux'
import {RegistrationForm} from "../../components"
import {registerUserOnServer} from "../../actions"
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => dispatch(registerUserOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success('Registration Successfully')
            } else {
                NotificationManager.error('Registration failed!')
            }
            return json
        }
    )
})

const mapStateToProps = (state, ownProps) => {
    return {
        errorMsg: state.user.error
    }
}

const RegistrationFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationForm)

export default RegistrationFormContainer