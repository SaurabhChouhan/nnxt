import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperDetails: (employee, StartDate, EndDate) => dispatch(A.addTaskPlanningFilterOnServer(employee, null, null)),
    getDeveloperStartDateDetails: (employee, StartDate, EndDate) =>dispatch(A.addTaskPlanningFilterOnServer(employee, null, null)),
    getDeveloperEndDateDetails: (employee, StartDate, EndDate) => dispatch(addTaskPlanningFilterOnServer(employee, null, null)),
})

const mapStateToProps = (state, ownProps) => ({
    team: state.release.selected && state.release.selected.team ? state.release.selected.team : [],

})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer