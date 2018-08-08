import {connect} from 'react-redux'
import {ReleaseMoveTaskPlanForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (newTaskPlanning) => {
        return dispatch(A.moveTaskPlanOnServer(newTaskPlanning)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Merged")
                dispatch(A.hideComponent(COC.MOVE_TASK_PLAN_DIALOG))
            }
            else NotificationManager.error("Task Planning Not Merged")

            return json
        })


    }
})

const mapStateToProps = (state, ownProps) => ({
    //team: state.release.selectedRelease && state.release.selectedRelease.team ? state.release.selectedRelease.team : [],
    initial: state.release.selectedRelease.iterations[0]
})


const ReleaseMoveTaskPlanFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseMoveTaskPlanForm)

export default ReleaseMoveTaskPlanFormContainer