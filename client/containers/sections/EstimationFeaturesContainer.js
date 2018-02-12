import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";
import {initialize} from "redux-form";
import * as SC from "../../../server/serverconstants"
import {NotificationManager} from "react-notifications";
import * as EC from "../../../server/errorcodes";

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})
const mapDispatchToProps = (dispatch, ownProps) => ({
    showEditFeatureForm: (values) => {
        // would always be called by estimator
        dispatch(A.showComponent(COC.ESTIMATION_FEATURE_DIALOG))
        // initialize
        let feature = {}
        feature.estimation = values.estimation
        feature._id = values._id
        feature.name = values.estimator.name
        feature.description = values.estimator.description
        dispatch(initialize('estimation-feature', feature))
    },
    showFeatureSuggestionForm: (values, loggedInUserRole) => {
        console.log("showFeatureSuggestionForm feature", values)
        // Can be called by both estimator and negotiator
        let feature = {
            loggedInUserRole: loggedInUserRole,
            readOnly: {}
        }
        feature._id = values._id
        feature.estimation = values.estimation
        if (loggedInUserRole == SC.ROLE_NEGOTIATOR) {
            /* Since negotiator is logged in, he would see details of negotiator section in editable form and details of estimator section in read only form  */
            feature.name = values.negotiator.name
            feature.description = values.negotiator.description

            feature.readOnly.name = values.estimator.name
            feature.readOnly.description = values.estimator.description

        } else if (loggedInUserRole == SC.ROLE_ESTIMATOR) {
            /* Since estimator is logged in, he would see details of  estimator section in editable form  */
            feature.name = values.estimator.name
            feature.description = values.estimator.description

            feature.readOnly.name = values.negotiator.name
            feature.readOnly.description = values.negotiator.description

        }
        console.log("feature", feature)

        dispatch(initialize("estimation-suggest-feature", feature))
        dispatch(A.showComponent(COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG))

    },
    deleteFeature: (feature) => {
        console.log("delete feature", feature)
        return dispatch(A.deleteFeatureByEstimatorOnServer(feature.estimation._id, feature._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Feature Deleted successfully")
            }
            else if (json.code && json.code == EC.INVALID_USER) {
                NotificationManager.error("Feature Deletion Failed You are not owner of this feature !")
            } else if (json.code && json.code == EC.ACCESS_DENIED) {
                NotificationManager.error("You are not allowed to delete this feature !")
            }
            else
                NotificationManager.error("Feature Deletion Failed !")

        })
    },
    toggleEditRequest: (feature) => {
        console.log("toggleEditRequest", feature)
    },
    toggleGrantEdit: (feature) => {
        // Call grant edit API which automatically toggles input
        console.log("toggleGrantEdit", feature)
    },
    toggleDeleteRequest: (values) => {
        console.log("toggleDeleteRequest", values)
    }
})

const EstimationFeaturesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFeatures)

export default EstimationFeaturesContainer