import { connect } from 'react-redux'
import AppHome from '../../components/pages/AppHome'
import { withRouter } from 'react-router-dom'
import { showComponent } from "../../actions";
import { CALENDAR_TASK_PAGE } from "../../components/componentConsts";
import * as A from "../../actions";

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    todayAllNotifications: state.notification && state.notification.todayAllNotifications ? state.notification.todayAllNotifications : null,
    showLoader: state.app.showLoader
})

const mapDispatchToProps = (dispatch) => ({
    showLaunchComponent: () => {
        dispatch(A.getAllTaskPlansFromServer())
        dispatch(showComponent(CALENDAR_TASK_PAGE))
    },
    dispatch: dispatch
})

const AppHomeContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHome))

export default AppHomeContainer
