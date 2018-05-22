import {connect} from 'react-redux'
import {ReleaseDeveloperScheduleForm} from '../../components'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperSchedules: (employeeID, from) => {
        if (from && employeeID) {
            return dispatch(A.getDeveloperSchedulesFromServer(employeeID.toString(), from))
        } else if (employeeID && employeeID != undefined) {
            return NotificationManager.error('Date is not picked up properly!')

        } else return NotificationManager.error('Employee is not selected!')


    }
})


const mapStateToProps = (state) => ({
    team: state.user && state.user.allDevelopers && state.user.allDevelopers.length ? [...state.user.allDevelopers,
        {
            "_id": "all",
            "name": "All developer of this task"
        }] : [],
    initialValues: {
        "employeeId": undefined,
        "fromSchedule": moment(state.release.fromSchedule).toDate()
    }
})

const ReleaseDeveloperScheduleFormContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleFormContainerContainer
