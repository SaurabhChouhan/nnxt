import {connect} from 'react-redux'
import {EstimationSuggestFeatureForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from "../../../server/serverconstants"
import * as EC from "../../../server/errorcodes"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (values._id) {
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_SUGGEST_FEATURE_FORM_SUBMIT, "values:", values)
            dispatch(A.updateFeatureToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Added feature suggestion")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Updated feature")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG))
                } else {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.error("Suggestions not saved")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.error("Feature updates failed")
                }
            })
        }
        else {
            values.estimatedHours = Number(values.estimatedHours)
            logger.debug(logger.ESTIMATION_SUGGEST_FEATURE_FORM_SUBMIT, "values:", values)
            dispatch(A.addFeatureToEstimationOnServer(values)).then(json => {
                if (json.success) {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR)
                        NotificationManager.success("Feature Suggested")
                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                        NotificationManager.success("Feature Added")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG))
                } else {
                    if (values.loggedInUserRole == SC.ROLE_NEGOTIATOR) {
                        if (json.code == EC.ACCESS_DENIED){
                            throw new SubmissionError({name: "You dont have permission "})
                            NotificationManager.error("Feature Suggestion Failed You dont have permission from Estimator")
                        }
                        NotificationManager.error("Update Feature Suggestion Failed")
                    }

                    else if (values.loggedInUserRole == SC.ROLE_ESTIMATOR)
                    {
                        if (json.code == EC.ACCESS_DENIED){
                            NotificationManager.error("Feature Suggestion Failed You dont have permission from Negotiator")
                        }
                        NotificationManager.error("Feature Addition Failed")
                    }

                }
            })
        }

    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected,
    features: state.estimation.features
})

const EstimationSuggestFeatureFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSuggestFeatureForm)

export default EstimationSuggestFeatureFormContainer