import {connect} from 'react-redux'
import {ReleaseDeveloperScheduleForm} from '../../components'
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'
import {ALL} from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperSchedules: (employeeID, month, year, releaseID) => {
        if (employeeID !== undefined) {
            return dispatch(A.getEmployeeWorkCalendarFromServer(employeeID.toString(), month, year, releaseID))
        } else if (employeeID == undefined) {
            return dispatch(A.getEmployeeWorkCalendarFromServer(ALL, month, year, releaseID))
        } else
            return NotificationManager.error('Date is not picked up properly!')


    }
})


const mapStateToProps = (state) => ({
    initialValues: {
        'employeeId': undefined
    }
})

const ReleaseDeveloperScheduleFormContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleFormContainerContainer
