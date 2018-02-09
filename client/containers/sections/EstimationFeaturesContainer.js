import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";
import {initialize} from "redux-form";
import * as SC from "../../../server/serverconstants"
import {NotificationManager} from "react-notifications";

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
    showFeatureSuggestionForm: (feature, loggedInUserRole) => {
        // Can be called by both estimator and negotiator

    },
    deleteFeature: (feature) => {
        console.log("delete feature", feature)
        return dispatch(A.deleteFeatureByEstimatorOnServer(feature.estimation._id, feature._id)).then(json => {
            if (json.success) {
                NotificationManager.success("Feature Deleted successfully")
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