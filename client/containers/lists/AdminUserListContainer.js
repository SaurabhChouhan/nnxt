import {connect} from 'react-redux'
import {AdminUserList} from "../../components"
import {showComponentHideOthers, deleteUserOnServer} from "../../actions";
import {ADMIN_USER_FORM} from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showAdminUserEditForm: (user) => {
        dispatch(showComponentHideOthers(ADMIN_USER_FORM)),
            dispatch(initialize('admin-user', user))
    },
    deleteAdminUser: (userId) => dispatch(deleteUserOnServer(userId)).then(json => {
        if (json.success) {
            NotificationManager.success('User Deleted Successfully')
        } else {
            NotificationManager.error('User Not Deleted!')
            throw new SubmissionError({users: "User Deletion Failed"})
        }
    }),
    showAdminUserForm: () => dispatch(showComponentHideOthers(ADMIN_USER_FORM))
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        AdminUsers: state.user.all
    }
}

const AdminUserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminUserList)
export default AdminUserListContainer