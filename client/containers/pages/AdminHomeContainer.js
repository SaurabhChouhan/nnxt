import {connect} from 'react-redux'
import AdminHome from '../../components/pages/AdminHome'
import {withRouter} from 'react-router-dom'

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn
})

const AdminHomeContainer = withRouter(connect(
    mapStateToProps
)(AdminHome))

export default AdminHomeContainer
