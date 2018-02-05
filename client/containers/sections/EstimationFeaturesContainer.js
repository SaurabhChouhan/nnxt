import {connect} from 'react-redux'
import {EstimationFeatures} from "../../components"

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,
    loggedInUserRole: state.estimation.selected.loggedInUserRole
})
const mapDispatchToProps = (dispatch, ownProps) => ({})

const EstimationFeaturesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFeatures)

export default EstimationFeaturesContainer