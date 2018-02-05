import {connect} from 'react-redux'
import {EstimationFeatureForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        logger.debug(logger.ESTIMATION_FEATURE_FORM_SUBMIT, "values:", values)
        dispatch(A.addFeatureToEstimationOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success("Feature Added")
                // hide dialog
                dispatch(A.hideComponent(COC.ESTIMATION_FEATURE_DIALOG))
            } else {
                NotificationManager.error("Feature Addition Failed")
            }
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected
})

const EstimationFeatureFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFeatureForm)

export default EstimationFeatureFormContainer