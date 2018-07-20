import {connect} from 'react-redux'
import {SidebarSection} from "../../components/sections";

const mapStateToProps = (state) => ({
    loggedInUser: state.user.loggedIn
})
const mapDispatchToProps = (dispatch, ownProps) => ({})

const SidebarSectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarSection)

export default SidebarSectionContainer