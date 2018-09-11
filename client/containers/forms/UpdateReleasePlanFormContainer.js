import {connect} from 'react-redux'
import {UpdateReleasePlanForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("values", values)
        if (values.iteration_type === SC.ITERATION_TYPE_PLANNED) {
            values.estimatedHours = Number(values.estimatedHours)
            values.estimatedBilledHours = Number(values.estimatedBilledHours)
            dispatch(A.releasePlanPlannedUpdateOnServer(values)).then(json => {
                if (json.success) {
                    dispatch(A.hideComponent(COC.UPDATE_RELEASE_PLAN_FORM_DIALOG))
                    /*
                    NotificationManager.success("Release Plan Added")
                    dispatch(A.getReleasePlansFromServer(values.release._id, SC.ALL, SC.ALL))
                    dispatch(A.getReleaseFromServer(values.release._id))

                    */
                }

            })
        }
        else {
            /*
            dispatch(A.releasePlanUnplannedAddToReleaseOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Added Unplanned To Release")
                    // hide dialog
                    dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
                }
                dispatch(A.getReleasePlansFromServer(values.release._id, SC.ALL, SC.ALL))
            })
            */
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