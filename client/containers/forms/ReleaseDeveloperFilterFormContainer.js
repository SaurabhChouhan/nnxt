import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"
import * as SC from "../../../server/serverconstants"
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getEmployeePlanDetails: (employeeId, startDate, endDate, releaseID) => {
        if (!employeeId) {
            return NotificationManager.error("Please select employee")
        } else {

            if (!startDate)
                startDate = SC.NONE

            if (!endDate)
                endDate = SC.NONE
            return dispatch(A.getEmployeePlanDetailsForRelease(employeeId, startDate, endDate, releaseID))
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    team: state.release.teamOfRelease,
    selectedReleaseID: state.release.selectedRelease._id
})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer