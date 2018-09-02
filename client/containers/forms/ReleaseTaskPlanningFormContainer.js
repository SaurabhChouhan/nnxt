import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'
import {ALL} from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (taskPlan) => {
        taskPlan.planning.plannedHours = Number(taskPlan.planning.plannedHours)
        return dispatch(A.addTaskPlanningOnServer(taskPlan)).then(json => {
            if (json.success) {
                console.log("==== taskPlan Planning added ==== ", taskPlan.employee._id, taskPlan.workCalendarEmployeeID)
                NotificationManager.success("taskPlan Planning Added")
                dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
                // If workCalendar employee id matches with task planning employee id fetch work calendar
                if (taskPlan.workCalendarEmployeeIDs.indexOf(taskPlan.employee._id.toString()) > -1) {
                    if (taskPlan.workCalendarEmployeeIDs.length > 1) {
                        // issue fetch for all release employees
                        dispatch(A.getEmployeeWorkCalendarFromServer(ALL, null, null, taskPlan.release._id))
                    }
                    else
                        dispatch(A.getEmployeeWorkCalendarFromServer(taskPlan.employee._id))
                }
                return json
            }
            else {
                return NotificationManager.error(json.message)
            }
        })

    }
})

const mapStateToProps = (state, ownProps) => ({
    releaseTeam: state.release && state.release.selectedRelease && state.release.selectedRelease.team && state.release.selectedRelease.team.length ? state.release.selectedRelease.team : [],
    allTeam: state.user.allDevelopers && state.user.allDevelopers ? state.user.allDevelopers : [],
    initial: state.release.selectedRelease.iterations[state.release.selectedReleasePlan.release.iteration.idx],
    releasePlan: state.release.selectedReleasePlan
})


const ReleaseTaskPlanningFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningFormContainer