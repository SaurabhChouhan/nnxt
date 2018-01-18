import {connect} from 'react-redux'
import AppRouter from '../components/AppRouter'
import {withRouter} from 'react-router-dom'

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    isSuperAdmin:state.user.isSuperAdmin,
    isAdmin:state.user.isAdmin,
    loggedInUser: state.user.loggedIn
})

const AppRouterContainer = withRouter(connect(
    mapStateToProps
)(AppRouter))

export default AppRouterContainer
