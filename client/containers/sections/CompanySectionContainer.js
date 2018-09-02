import {connect} from 'react-redux'
import {CompanySection} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({}
)

const mapStateToProps = (state, ownProps) => ({
    developers: state.user.allDevelopers && state.user.allDevelopers ? [{
        _id: 'all',
        name: 'All Employees'
    }, ...state.user.allDevelopers] : []
})


const CompanySectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanySection)

export default CompanySectionContainer