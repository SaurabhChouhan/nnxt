import {connect} from 'react-redux'
import SuperAdminHome from '../../components/pages/SuperAdminHome'
import {withRouter} from 'react-router-dom'

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn
})

const SuperAdminHomeContainer = withRouter(connect(
    mapStateToProps
)(SuperAdminHome))

export default SuperAdminHomeContainer
