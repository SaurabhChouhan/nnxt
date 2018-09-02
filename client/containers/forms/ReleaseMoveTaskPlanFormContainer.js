import {connect} from 'react-redux'
import {ReleaseMoveTaskPlanForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"
import {ALL} from "../../../server/serverconstants";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (newTaskPlanning) => {
        //console.log("release move ", newTaskPlanning)
        return dispatch(A.moveTaskPlanOnServer(newTaskPlanning)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Merged")
                dispatch(A.hideComponent(COC.MOVE_TASK_PLAN_DIALOG))

                if (newTaskPlanning.workCalendarEmployeeIDs.indexOf(newTaskPlanning.employee._id.toString()) > -1) {
                    if (newTaskPlanning.workCalendarEmployeeIDs.length > 1) {
                        // issue fetch for all release employees
                        dispatch(A.getEmployeeWorkCalendarFromServer(ALL, null, null, newTaskPlanning.release._id))
                    }
                    else
                        dispatch(A.getEmployeeWorkCalendarFromServer(newTaskPlanning.employee._id))
                }
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