import {connect} from 'react-redux'
import {ReleaseDeveloperPlanShiftForm} from "../../components"
import * as A from "../../actions"
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    shiftTasksToFuture: (employeeId, baseDate, daysToShift, releasePlanID) => {
        if (!employeeId || !baseDate || !daysToShift) {
            if (!employeeId)
                return NotificationManager.error("Please select employee")
            else if (!baseDate)
                return NotificationManager.error("Please select base date")

            else if (!daysToShift)
                return NotificationManager.error("Please select Number of days to shift")
        }
        else return dispatch(A.shiftTasksToFutureOnServer({
            employeeId: employeeId,
            baseDate: baseDate,
            daysToShift: daysToShift,
            releasePlanID: releasePlanID
        })).then(json => {
            if (json.success) {
                NotificationManager.success("Plan shifted to future")
            }
            else NotificationManager.error("Plan shifting failed")
        })
    },

    shiftTasksToPast: (employeeId, baseDate, daysToShift, releasePlanID) => {
        if (!employeeId || !baseDate || !daysToShift) {
            if (!employeeId)
                return NotificationManager.error("Please select employee")
            else if (!baseDate)
                return NotificationManager.error("Please select base date")

            else if (!daysToShift)
                return NotificationManager.error("Please select Number of days to shift")
        }
        else return dispatch(A.shiftTasksToPastOnServer({
            employeeId: employeeId,
            baseDate: baseDate,
            daysToShift: daysToShift,
            releasePlanID: releasePlanID
        })).then(json => {
            if (json.success) {
                NotificationManager.success("Plan shifted to past")
            }
            else NotificationManager.error("Plan shifting failed")
        })
    },

})

const mapStateToProps = (state, ownProps) => {
    let days = [
        {"day": 1},
        {"day": 2},
        {"day": 3},
        {"day": 4},
        {"day": 5},
        {"day": 6},
        {"day": 7},
        {"day": 8},
        {"day": 9},
        {"day": 10},
        {"day": 11},
        {"day": 12},
        {"day": 13},
        {"day": 14},
        {"day": 15},
        {"day": 16},
        {"day": 17},
        {"day": 18},
        {"day": 19},
        {"day": 20},
        {"day": 21},
        {"day": 22},
        {"day": 23},
        {"day": 24},
        {"day": 25},
        {"day": 26},
        {"day": 27},
        {"day": 28},
        {"day": 29},
        {"day": 30}
    ]
    return {
        releasePlan: state.release.selectedTask,
        team: state.release.selectedProject && state.release.selectedProject.team ? [...state.release.selectedProject.team,
            {
                "_id": "all",
                "name": "All developer of this task"
            }] : [],
        days
    }
}


const ReleaseDeveloperPlanShiftFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperPlanShiftForm)

export default ReleaseDeveloperPlanShiftFormContainer