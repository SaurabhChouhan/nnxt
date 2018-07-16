import {connect} from 'react-redux'
import {ReleasePlanningUpdateForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
   onSubmit: (updateRelease) => {

    return dispatch(A.updateReleasePlanOnServer(updateRelease)).then(json => {
            if (json.success) {
                NotificationManager.success("Release plan updated")
                dispatch(A.hideComponent(COC.UPDATE_RELEASE_PLANNING_DIALOG))
            }
            else NotificationManager.error("Release plan  updation failed")

            return json
        })


     }
})

const mapStateToProps = (state, ownProps) => ({
    initial: state.release.selectedRelease.iterations[0]
})

const ReleasePlanningUpdateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanningUpdateForm)

export default ReleasePlanningUpdateFormContainer