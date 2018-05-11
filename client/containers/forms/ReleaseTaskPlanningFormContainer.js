import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (task) => {
        task.planning.plannedHours = Number(task.planning.plannedHours)
        return dispatch(A.addTaskPlanningOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Added")
                dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
            }
            else NotificationManager.error("Task Planning Not Added")
        })

    }
})

const mapStateToProps = (state, ownProps) => ({
    team: state.user.userWithRoleCategory && state.user.userWithRoleCategory.team ? state.user.userWithRoleCategory.team : [],
    initial: state.release.selectedProject.initial
})


const ReleaseTaskPlanningFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningFormContainer