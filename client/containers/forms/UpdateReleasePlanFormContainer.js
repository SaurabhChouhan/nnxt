import {connect} from 'react-redux'
import {UpdateReleasePlanForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (values) => {
        if (values.iteration_type === SC.ITERATION_TYPE_PLANNED) {
            values.estimatedHours = Number(values.estimatedHours)
            values.estimatedBilledHours = Number(values.estimatedBilledHours)
            dispatch(A.releasePlanPlannedUpdateOnServer(values)).then(json => {
                if (json.success) {
                    dispatch(A.hideComponent(COC.UPDATE_RELEASE_PLAN_FORM_DIALOG))
                    dispatch(A.searchReleasePlansOnServer())
                    dispatch(A.getReleaseFromServer(values.release._id))
                    NotificationManager.success("Release-Task Updated")
                }
            })
        }
        else if(values.iteration_type === SC.ITERATION_TYPE_UNPLANNED){
            dispatch(A.releasePlanUnplannedUpdateOnServer(values)).then(json => {
                if (json.success) {
                    dispatch(A.hideComponent(COC.UPDATE_RELEASE_PLAN_FORM_DIALOG))
                    dispatch(A.searchReleasePlansOnServer())
                    NotificationManager.success("Release-Task updated")
                }
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    release: state.release.selectedRelease,
    releasePlans: state.release.releasePlans,
    iterations: SC.ITERATION_TYPE_LIST_WITH_NAME,
})

const UpdateReleasePlanFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateReleasePlanForm)

export default UpdateReleasePlanFormContainer