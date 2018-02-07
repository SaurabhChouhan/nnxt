import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";
import {initialize} from "redux-form";

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})
const mapDispatchToProps = (dispatch, ownProps) => ({
    showEditFeatureForm: (values) => {
        dispatch(A.showComponent(COC.ESTIMATION_FEATURE_DIALOG))
        // initialize
        let feature = {}
        feature.estimation = values.estimation
        feature._id = values._id
        feature.name = values.estimator.name
        feature.description = values.estimator.description
        dispatch(initialize('estimation-feature', feature))
    },
    deleteFeature: (values) => {console.log("delete feature",values)}
})

const EstimationFeaturesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFeatures)

export default EstimationFeaturesContainer