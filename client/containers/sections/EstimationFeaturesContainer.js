import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,
    expandedFeatureID: state.estimation.expandedFeatureID,
    expandedTaskID: state.estimation.expandedTaskID,
    filter: state.estimation.filter
})

const EstimationFeaturesContainer = connect(
    mapStateToProps
)(EstimationFeatures)

export default EstimationFeaturesContainer