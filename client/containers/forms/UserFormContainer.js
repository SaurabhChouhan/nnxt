import {connect} from 'react-redux'
import UserForm from "../../components/forms/UserForm"
import {addUserOnServer, editUserOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {USER_LIST} from "../../components/componentConsts";
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(addUserOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(USER_LIST))
                        NotificationManager.success('User Added Successful');
                    } else {
                        NotificationManager.error('User Added Failed');
                        throw new SubmissionError(response.errors)
                    }
                }
            )
        }
        else {
            dispatch(editUserOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(USER_LIST))
                        NotificationManager.success('User Updated Successful');
                    } else {
                        NotificationManager.error('User Updated Failed');
                        throw new SubmissionError(response.errors)
                    }
                }
            )

        }
    },
    showUserList: () => dispatch(showComponentHideOthers(USER_LIST))
})

const mapStateToProps = (state, ownProps) => ({
    roles: state.role.all

    // roles:state.users.roles
})

const UserFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserForm)

export default UserFormContainer