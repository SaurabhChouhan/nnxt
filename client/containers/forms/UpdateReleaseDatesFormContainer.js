import {connect} from 'react-redux'
import {UpdateReleaseDatesForm} from "../../components"
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (ReleaseDates) => {
        return dispatch(A.updateReleaseDatesOnServer(ReleaseDates)).then(json => {
            if (json.success) {
                NotificationManager.success("Release dates updated")
                dispatch(A.hideComponent(COC.UPDATE_RELEASE_DATES_DIALOG))
            }
            else NotificationManager.error("Release dates update failed !")

            return json
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    release: state.release.selectedRelease

})

const UpdateReleaseDatesFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateReleaseDatesForm)

export default UpdateReleaseDatesFormContainer