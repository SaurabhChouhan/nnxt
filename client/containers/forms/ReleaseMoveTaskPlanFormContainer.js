import {connect} from 'react-redux'
import {ReleaseMoveTaskPlanForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (newTaskPlanning) => {
        //console.log("release move ", newTaskPlanning)
        return dispatch(A.moveTaskPlanOnServer(newTaskPlanning)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Merged")
                dispatch(A.hideComponent(COC.MOVE_TASK_PLAN_DIALOG))

                if (newTaskPlanning.employee._id.toString() == newTaskPlanning.workCalendarEmployeeID.toString())
                    dispatch(A.getEmployeeWorkCalendarFromServer(newTaskPlanning.workCalendarEmployeeID))
                return json

            }
            else NotificationManager.error(json.message)

            return json
        })
    }
})

const mapStateToProps = (state) => ({
    selectedIteration: state.release.selectedRelease.iterations[state.release.selectedIteration.idx]
})


const ReleaseMoveTaskPlanFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseMoveTaskPlanForm)

export default ReleaseMoveTaskPlanFormContainer