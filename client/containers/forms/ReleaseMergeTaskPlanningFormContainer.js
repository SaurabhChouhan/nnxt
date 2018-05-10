import {connect} from 'react-redux'
import {ReleaseMergeTaskPlanningForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (newTaskPlanning) => {
        console.log("newTaskPlanning", newTaskPlanning)

        return dispatch(A.mergeTaskPlanningOnServer(newTaskPlanning)).then(json => {
            console.log(".then json", json)
            if (json.success) {
                NotificationManager.success("Task Planning Merged")
                dispatch(A.hideComponent(COC.MERGE_TASK_PLANNING_DIALOG))
            }
            else NotificationManager.error("Task Planning Not Merged")
        })


    }
})

const mapStateToProps = (state, ownProps) => ({
    //team: state.release.selectedProject && state.release.selectedProject.team ? state.release.selectedProject.team : [],
    initial: state.release.selectedProject.initial
})


const ReleaseMergeTaskPlanningFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseMergeTaskPlanningForm)

export default ReleaseMergeTaskPlanningFormContainer