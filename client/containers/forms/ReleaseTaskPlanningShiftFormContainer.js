import {connect} from 'react-redux'
import {ReleaseTaskPlanningShiftForm} from "../../components"
import * as A from "../../actions"
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperDetails: (employeeId, StartDate, EndDate) => {
        if (!employeeId) {
            NotificationManager.error("Please select employee")
        }
        else return dispatch(A.getDeveloperDetailsWithFilterOnServer(employeeId, StartDate, EndDate))
    }

})

const mapStateToProps = (state, ownProps) => ({


})


const ReleaseTaskPlanningShiftFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningShiftForm)

export default ReleaseTaskPlanningShiftFormContainer