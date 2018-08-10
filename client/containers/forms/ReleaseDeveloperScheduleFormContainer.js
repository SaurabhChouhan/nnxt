import {connect} from 'react-redux'
import {ReleaseDeveloperScheduleForm} from '../../components'
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperSchedules: (employeeID, month, year) => {
        console.log("employee id is ", employeeID)
        console.log("month is ", month)
        if (employeeID !== undefined) {
            if (employeeID === '')
                // clearing work calendar
                return dispatch(A.addWorkCalendar({}))
            else
                return dispatch(A.getEmployeeWorkCalendarFromServer(employeeID.toString(), month, year))
        } else if (employeeID == undefined) {
            return NotificationManager.error('Please select employee!')
        } else
            return NotificationManager.error('Date is not picked up properly!')


    }
})


const mapStateToProps = (state) => ({
    team: state.release.teamOfRelease,
    initialValues: {
        'employeeId': undefined
    }
})

const ReleaseDeveloperScheduleFormContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleFormContainerContainer
