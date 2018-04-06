import {connect} from 'react-redux'
import {UserList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editUser: (user) => {
        dispatch(A.showComponentHideOthers(COC.USER_FORM)),
            dispatch(initialize('user', user))
    },
    deleteUser: (userId) => dispatch(A.deleteUserOnServer(userId)).then(json => {
        if (json.success) {
            NotificationManager.success('User Deleted Successfully')
        } else {
            NotificationManager.error('User Not Deleted!')
            throw new SubmissionError({users: "User Deletion Failed"})
        }
    }),
    showUserForm: () => dispatch(A.showComponentHideOthers(COC.USER_FORM))
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