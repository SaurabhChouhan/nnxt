import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as logger from '../../clientLogger'
import {addClientOnServer, editClientOnServer} from "../../actions"
import {SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (task) => {
           console.log("taskplanning dialog form submit",task)
            dispatch(A.addTaskPlanningOnServer(task)).then(json => {
                if (json.success) {
                    NotificationManager.success("Task Planning Added")
                    // hide dialog
                    dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
                } else {
                    NotificationManager.error("Task Planning Addition Failed")
                }
            })
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