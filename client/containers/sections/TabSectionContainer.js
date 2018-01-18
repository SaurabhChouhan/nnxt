import {connect} from 'react-redux'
import TabSection from '../../components/sections/TabSection'

const mapStateToProps = (state) => ({
    visibleComponents: state.app.visibleComponents,
    loggedInUser: state.user.loggedIn
})
const mapDispatchToProps = (dispatch, ownProps) => ({})

const TabSectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TabSection)

export default TabSectionContainer