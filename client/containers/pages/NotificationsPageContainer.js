import {connect} from 'react-redux'
import {initialize} from 'redux-form'
import * as A from "../../actions"
import {NotificationsPage} from "../../components"
import * as logger from '../../clientLogger'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(A.updateUserSettingsOnServer(values)).then(json => {
            if (json.success) {
                dispatch(initialize('user-profile', json.data))
                NotificationManager.success('User Profile Updated Successfully')
            }
            else {
                NotificationManager.error(json.message);
            }
        }),
            logger.debug(logger.USER_PROFILE_FORM_CONNECT, "onSubmit():", values)
    },
    deleteNotifications: (id) => {
        let ids = [{_id: id}]
        dispatch(A.deleteNotificationsFromServer(ids)).then(json => {
            if (json.success) {
                NotificationManager.success('Notification Deleted Successfully')
                dispatch(A.getAllNotificationsFromServer())
            }
            else {
                NotificationManager.error('Notification Deletion Failed');
            }
        })
    }

})

const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn,
    allNotifications: state.notification.allNotifications
})

const NotificationsPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsPage)

export default NotificationsPageContainer