import {connect} from 'react-redux'
import AppHome from '../../components/pages/AppHome'
import {withRouter} from 'react-router-dom'

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn,
    todayAllNotifications: state.notification && state.notification.todayAllNotifications ? state.notification.todayAllNotifications : null
})

const AppHomeContainer = withRouter(connect(
    mapStateToProps
)(AppHome))

export default AppHomeContainer
