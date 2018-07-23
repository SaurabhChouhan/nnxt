import {connect} from 'react-redux'
import {ReleasePlanAddToReleaseForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (values.iteration_type === SC.ITERATION_TYPE_PLANNED) {
            values.estimatedHours = Number(values.estimatedHours)
            values.estimatedBilledHours = parseInt(values.estimatedBilledHours)
            dispatch(A.releasePlanPlannedAddToReleaseOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Added  Planned To ReleasePlan")
                    // hide dialog
                    dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
                }

            })
        }
        else {
            dispatch(A.releasePlanUnplannedAddToReleaseOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Added Unplanned To Release")
                    // hide dialog
                    dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
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

const ReleasePlanAddToReleaseFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanAddToReleaseForm)

export default ReleasePlanAddToReleaseFormContainer