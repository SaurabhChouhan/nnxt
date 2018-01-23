import {connect} from 'react-redux'
import UserForm from "../../components/forms/UserForm"
import {addUserOnServer, editUserOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {USER_LIST} from "../../components/componentConsts";
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";
import {
    ALREADY_EXISTS,
    EMAIL_ALREADY_USED,
    PASSWORD_NOT_MATCHED
} from "../../../server/errorcodes";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(addUserOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(USER_LIST))
                        NotificationManager.success('User Added Successful');
                    } else {
                        NotificationManager.error('User Added Failed');
                        if (json.code && json.code == ALREADY_EXISTS) {
                            // role already exists throw SubmissionError to show appropriate error
                            throw new SubmissionError({email: 'Email already exists'})
                        }
                        throw new SubmissionError(json.errors)
                    }
                }
            )
        }
        else {
            return dispatch(editUserOnServer(values)).then((json) => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(USER_LIST))
                        NotificationManager.success('User Updated Successful');
                    } else {
                        NotificationManager.error('User Updated Failed');
                        if (json.code && json.code == EMAIL_ALREADY_USED) {
                            throw new SubmissionError({email: 'Email already exists'})
                            // role already exists throw SubmissionError to show appropriate error
                        }
                        else if (json.code && json.code == PASSWORD_NOT_MATCHED) {
                            throw new SubmissionError({password: 'Password not matched'})
                        }
                        else throw new SubmissionError(json.errors)
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