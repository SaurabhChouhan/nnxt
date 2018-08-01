import {connect} from 'react-redux'
import {ReleaseDevelopersSchedules} from '../../components'
import * as A from '../../actions'
import {initialize} from 'redux-form'
import {TASK_SHIFT_DIALOG} from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    getEmployeeSettings: () => dispatch(A.getEmployeeSettingFromServer()),
    dispatch,
    showTaskShiftDialog:(day, month, year, employee) => {

        dispatch(initialize('task-plan-shift', {
            day,
            month,
            year,
            employee
        }))

        dispatch(A.showComponent(TASK_SHIFT_DIALOG))

    }
})


const mapStateToProps = (state) => ({
    schedules: state.release.schedules,
    workCalendar: state.employee.workCalendar,
    from: state.release.from,
    employeeSetting: state.release.employeeSetting
})

const ReleaseDevelopersSchedulesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDevelopersSchedules)

export default ReleaseDevelopersSchedulesContainer
