import {connect} from 'react-redux'
import {EstimationFilterForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        dispatch(A.addFilteredEstimation(formValues))
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
    },
    clearFilter: () => {
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))

        dispatch(A.clearFilterFromEstimation())
    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected,
    initialValues: {
        "changedByNegotiator": state.estimation.filter.changedByNegotiator,
        "changedByEstimator": state.estimation.filter.changedByEstimator,
        "permissionRequested": state.estimation.filter.permissionRequested,
        "permissionGranted": state.estimation.filter.permissionGranted
    }

})

const EstimationFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFilterForm)

export default EstimationFilterFormContainer