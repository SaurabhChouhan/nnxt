import {connect} from 'react-redux'
import {ReleaseDeveloperScheduleForm} from '../../components'
import moment from 'moment'
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperSchedules: (employeeID, month, year) => {
        if (month && employeeID) {
            return dispatch(A.getEmployeeWorkCalendarFromServer(employeeID.toString(), month, year))
        } else if (!employeeID || employeeID == undefined) {
            return NotificationManager.error('Employee is not selected!')
        } else
            return NotificationManager.error('Date is not picked up properly!')


    }
})


const mapStateToProps = (state) => ({
    team: state.user && state.user.allDevelopers && state.user.allDevelopers.length ? state.user.allDevelopers : [],
    initialValues: {
        'employeeId': undefined
    }
})

const ReleaseDeveloperScheduleFormContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleFormContainerContainer
