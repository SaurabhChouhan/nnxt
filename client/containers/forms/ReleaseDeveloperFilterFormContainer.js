import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getEmployeePlanDetails: (employeeId, StartDate, EndDate, releaseID) => {
        if (!employeeId) {
            return NotificationManager.error("Please select employee")
        }
        else return dispatch(A.getEmployeePlanDetailsForRelease(employeeId, StartDate, EndDate, releaseID))
    }
})

const mapStateToProps = (state, ownProps) => ({
    team: state.user && state.user.allDevelopers && state.user.allDevelopers.length ? state.user.allDevelopers : [],
    selectedReleaseID: state.release.selectedRelease._id
})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer