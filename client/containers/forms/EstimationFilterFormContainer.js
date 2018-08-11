import {connect} from 'react-redux'
import {EstimationFilterForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import {initialize} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        dispatch(A.addFilteredEstimation(formValues))
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
    },
    selectAllFilter: () => {
        //dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
        //dispatch(A.selectAllFilterFromEstimation())
        dispatch(initialize('Estimation-filter', {
            changedByNegotiator: true,
            changedByEstimator: true,
            permissionRequested: true,
            addedFromRepository: true,
            addedByNegotiator: true,
            addedByEstimator: true,
            hasError: true
        }))
    },
    clearFilter: () => {
        //dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
        //dispatch(A.clearFilterFromEstimation())
        dispatch(initialize('Estimation-filter', {
            changedByNegotiator: false,
            changedByEstimator: false,
            permissionRequested: false,
            addedFromRepository: false,
            addedByNegotiator: false,
            addedByEstimator: false,
            hasError: false
        }))
    },
    newChangedFilter: (status) => {

        if(status == SC.STATUS_ESTIMATION_REQUESTED || status == SC.STATUS_CHANGE_REQUESTED){
            // Estimation is editable for estimator
            dispatch(initialize('Estimation-filter', {
                changedByNegotiator: true,
                changedByEstimator: false,
                permissionRequested: false,
                addedFromRepository: false,
                addedByNegotiator: true,
                addedByEstimator: false,
                hasError: false
            }))
        } else {
            // Estimation is editable for negotiator
            dispatch(initialize('Estimation-filter', {
                changedByNegotiator: false,
                changedByEstimator: true,
                permissionRequested: false,
                addedFromRepository: false,
                addedByNegotiator: false,
                addedByEstimator: true,
                hasError: false
            }))
        }


    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected,
    initialValues: {
        "changedByNegotiator": state.estimation.filter.changedByNegotiator,
        "changedByEstimator": state.estimation.filter.changedByEstimator,
        "permissionRequested": state.estimation.filter.permissionRequested,
        "addedFromRepository": state.estimation.filter.addedFromRepository,
        "addedByNegotiator": state.estimation.filter.addedByNegotiator,
        "addedByEstimator": state.estimation.filter.addedByEstimator,
        "hasError": state.estimation.filter.hasError

    }

})

const EstimationFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFilterForm)

export default EstimationFilterFormContainer