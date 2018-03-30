import {connect} from 'react-redux'
import {UserList} from "../../components"
import {deleteUserOnServer, showComponentHideOthers} from "../../actions"
import {USER_FORM} from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editUser: (user) => {
        dispatch(showComponentHideOthers(USER_FORM)),
            dispatch(initialize('user', user))
    },
    deleteUser: (userId) => dispatch(deleteUserOnServer(userId)).then(json => {
        if (json.success) {
            NotificationManager.success('User Deleted Successfully')
        } else {
            NotificationManager.error('User Not Deleted!')
            throw new SubmissionError({users: "User Deletion Failed"})
        }
    }),
    showUserForm: () => dispatch(showComponentHideOthers(USER_FORM))
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        users: state.user.all
    }
}

const UserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList)

export default UserListContainer