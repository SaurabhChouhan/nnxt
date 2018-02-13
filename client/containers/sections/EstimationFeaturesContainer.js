import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,
    loggedInUserRole: state.estimation.selected.loggedInUserRole,
    expandedFeatureID: state.estimation.expandedFeatureID
})

const EstimationFeaturesContainer = connect(
    mapStateToProps
)(EstimationFeatures)

export default EstimationFeaturesContainer