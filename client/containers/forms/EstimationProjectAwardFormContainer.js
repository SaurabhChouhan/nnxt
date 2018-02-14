import {connect} from 'react-redux'
import {EstimationProjectAwardForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (values._id) {
            logger.debug(logger.ESTIMATION_FEATURE_FORM_SUBMIT, "values:", values)
            return dispatch(A.updateFeatureToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Feature Updated")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_FEATURE_DIALOG))
                } else {
                    NotificationManager.error("Feature updation Failed")
                }
            })
        }
        else {
            logger.debug(logger.ESTIMATION_FEATURE_FORM_SUBMIT, "values:", values)
            return dispatch(A.addFeatureToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Feature Added")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_FEATURE_DIALOG))
                } else {
                    NotificationManager.error("Feature Addition Failed")
                }
            })
        }

    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected
})

const EstimationProjectAwardFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationProjectAwardForm)

export default EstimationProjectAwardFormContainer