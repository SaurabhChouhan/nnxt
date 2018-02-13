import {connect} from 'react-redux'
import {editUserOnServer, updateUserSettingsOnServer} from "../../actions"
import {UserProfileForm} from "../../components"
import * as logger from '../../clientLogger'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(updateUserSettingsOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success('User Profile Updated Successfully')
            }
            else {
                NotificationManager.error('User Profile Update Failed');
            }
        }),
            logger.debug(logger.USER_PROFILE_FORM_CONNECT, "onSubmit():", values)
    }
})

const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn,
    initialValues: {

        "_id": state.user.loggedIn._id,
        "firstName": state.user.loggedIn.firstName,
        "lastName": state.user.loggedIn.lastName,
        "email": state.user.loggedIn.email,
        "phone": state.user.loggedIn.phone,
        "address": state.user.loggedIn.address,
        "dob": state.user.loggedIn.dob,
        "designation": state.user.loggedIn.designation,
        "employeeCode": state.user.loggedIn.employeeCode,
        "dateJoined": state.user.loggedIn.dateJoined,


    }

})

const UserProfileFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileForm)

export default UserProfileFormContainer