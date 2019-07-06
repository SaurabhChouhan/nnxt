import { connect } from 'react-redux'
import { ReleaseDeveloperScheduleForm } from '../../components'
import * as A from '../../actions'
import { NotificationManager } from 'react-notifications'
import { ALL } from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperSchedules: (employeeID, releaseTypes, month, year, releaseID) => {
        console.log(employeeID, releaseTypes, month, year, releaseID)
        if (employeeID !== undefined) {
            return dispatch(A.getEmployeeWorkCalendarFromServer(employeeID.toString(), releaseTypes, month, year, releaseID))
        } else if (employeeID == undefined) {
            return dispatch(A.getEmployeeWorkCalendarFromServer(ALL, releaseTypes, month, year, releaseID))
        } else
            return NotificationManager.error('Date is not picked up properly!')


    }
})


const mapStateToProps = (state) => ({
    initialValues: {
        'employeeId': undefined
    },
    totalPlannedHours: state.employee.workCalendar.totalPlannedHours,
    totalReportedHours: state.employee.workCalendar.totalReportedHours
})

const ReleaseDeveloperScheduleFormContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleFormContainerContainer
