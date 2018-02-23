import {connect} from 'react-redux'
import {RepositoryFeatureDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'


const mapDispatchToProps = (dispatch, ownProps) => ({
    addFeature: (EstimationId, featureId) => dispatch(A.addFeatureFromRepositoryToEstimationOnServer(EstimationId, featureId)).then(json => {
        if (json.success) {
            NotificationManager.success("Feature Added")
            // hide dialog
            dispatch(A.hideComponent(COC.REPOSITORY_FEATURE_DETAIL_DIALOG))
        } else {
            NotificationManager.error("Feature Addition Failed")
        }
    })
})


const mapStateToProps = (state) => ({
    feature: state.repository.feature,
    estimationId: state.estimation.selected && state.estimation.selected._id ? state.estimation.selected._id : undefined
})

const RepositoryFeatureDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)( RepositoryFeatureDetailPage)

export default RepositoryFeatureDetailPageContainer
