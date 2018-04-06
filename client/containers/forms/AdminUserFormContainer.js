import {connect} from 'react-redux'
import {AdminUserForm} from "../../components"
import {addUserOnServer, editUserOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {ADMIN_USER_LIST} from "../../components/componentConsts";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import {formValueSelector, SubmissionError} from "redux-form";

let selector = formValueSelector('role')
const mapDispatchToProps = (dispatch, ownProps) => ({

    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(addUserOnServer(values)).then(response => {
                if (response.success) {
                    dispatch(showComponentHideOthers(ADMIN_USER_LIST))
                    NotificationManager.success('User Added Successfully')
                } else {
                    NotificationManager.error('User Added Failed');
                    if (json.code && json.code == EC.ALREADY_EXISTS) {
                        // role already exists throw SubmissionError to show appropriate error
                        throw new SubmissionError({email: 'Email already exists'})
                    }
                    throw new SubmissionError({users: "User Already Exists"})
                }
            })
        } else {
            // Role is edited
            return dispatch(editUserOnServer(values)).then(response => {
                if (response.success) {
                    dispatch(showComponentHideOthers(ADMIN_USER_LIST))
                    NotificationManager.success('User Updated Successfully')
                } else {
                    NotificationManager.error('User Updated Failed');
                    if (json.code && json.code == EC.EMAIL_ALREADY_USED) {
                        throw new SubmissionError({email: 'Email already exists'})
                        // role already exists throw SubmissionError to show appropriate error
                    }
                    else if (json.code && json.code == EC.PASSWORD_NOT_MATCHED) {
                        throw new SubmissionError({password: 'Password not matched'})
                    }
                    throw new SubmissionError({users: "User edit failed!"})
                }
            })
        }
    },
    showAdminUserList: () => dispatch(showComponentHideOthers(ADMIN_USER_LIST))
})

const mapStateToProps = (state, ownProps) => ({
    roles: state.role.all

    // roles:state.users.roles
})

const UserFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminUserForm)

export default UserFormContainer