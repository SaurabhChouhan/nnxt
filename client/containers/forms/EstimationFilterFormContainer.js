import {connect} from 'react-redux'
import {EstimationFilterForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        dispatch(A.addFilteredEstimation(formValues))
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => ({

    loggedInUser: state.user.loggedIn,
    initialValues: {
        "repository": state.estimation.filter.repository,
        "estimator": state.estimation.filter.estimator,
        "negotiator": state.estimation.filter.negotiator,
        "changeRequested": state.estimation.filter.changeRequested,
        "grantPermission": state.estimation.filter.grantPermission,
        "suggestions": state.estimation.filter.suggestions,
    }

})

const EstimationFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFilterForm)

export default EstimationFilterFormContainer