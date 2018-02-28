import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (task) => {
            dispatch(A.addTaskPlanningToState(task)),
            dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
        }
})

const mapStateToProps = (state, ownProps) => ({
    team: state.release.selected && state.release.selected.team ? state.release.selected.team : []
})


const ReleaseTaskPlanningFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningFormContainer