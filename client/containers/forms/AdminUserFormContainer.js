import {connect} from 'react-redux'
import {AdminUserForm} from "../../components"
import {addUserOnServer, editUserOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {ADMIN_USER_LIST} from "../../components/componentConsts";
import {ALREADY_EXISTS} from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import {formValueSelector, SubmissionError} from "redux-form";
let selector = formValueSelector('role')
const mapDispatchToProps = (dispatch, ownProps) => ({

    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(addUserOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('User Added Successfully')
                    dispatch(showComponentHideOthers(ADMIN_USER_LIST))
                } else {
                    NotificationManager.error('User Not Added!')
                    throw new SubmissionError({users: "User Already Exists"})
                }
            })
        } else {
            // Role is edited
            return dispatch(editUserOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('User Updated Successfully')
                    dispatch(showComponentHideOthers(ADMIN_USER_LIST))
                } else {
                    NotificationManager.error('User edit failed!')
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