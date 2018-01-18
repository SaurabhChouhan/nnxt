import {connect} from 'react-redux'
import Home from '../../components/pages/Home'
import {withRouter} from 'react-router-dom'

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn
})

const HomeContainer = withRouter(connect(
    mapStateToProps
)(Home))

export default HomeContainer
