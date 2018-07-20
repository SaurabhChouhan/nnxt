import {connect} from 'react-redux'
import {EstimationAddToReleaseForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(A.addToReleaseOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success("Added To Release")
                // hide dialog
                dispatch(A.hideComponent(COC.ESTIMATION_ADD_TO_RELEASE_FORM_DIALOG))
            } else {
                NotificationManager.error("Add To Release Failed")
            }
        })
    }
})

const mapStateToProps = (state, ownProps) => ({})

const EstimationAddToReleaseFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationAddToReleaseForm)

export default EstimationAddToReleaseFormContainer