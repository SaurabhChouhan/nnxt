import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperDetails: (employeeId, StartDate, EndDate) => dispatch(A.getDeveloperDetailsWithFilterOnServer(employeeId, StartDate, EndDate)),
})

const mapStateToProps = (state, ownProps) => ({
    team: state.release.selected && state.release.selected.team ? state.release.selected.team : [],

})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer