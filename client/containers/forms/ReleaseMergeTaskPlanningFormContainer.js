import {connect} from 'react-redux'
import {ReleaseMergeTaskPlanningForm} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (task) => {/*
        return dispatch(A.addTaskPlanningOnServer(task)).then(json => {
            if (json.success) {
                NotificationManager.success("Task Planning Added")
                dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
            }
            else NotificationManager.error("Task Planning Not Added")
        })

    */
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