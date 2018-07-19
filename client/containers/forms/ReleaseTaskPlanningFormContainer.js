import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'
import * as EC from '../../../server/errorcodes'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (task) => {
        task.planning.plannedHours = Number(task.planning.plannedHours)
        return dispatch(A.addTaskPlanningOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Added")
                dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
            }
            else {
                if (json.errorCode === EC.NOT_FOUND) {
                    return NotificationManager.error(json.message)
                } else if (json.errorCode === EC.ACCESS_DENIED) {
                    return NotificationManager.error(json.message)
                } else if (json.errorCode === EC.NOT_ALLOWED_TO_ADD_EXTRA_EMPLOYEE) {
                    return NotificationManager.error(json.message)
                } else if (json.errorCode === EC.TIME_OVER) {
                    return NotificationManager.error(json.message)
                } else if (json.errorCode === EC.CANT_PLAN) {
                    return NotificationManager.error(json.message)
                } else NotificationManager.error("Task Planning Failed!")
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