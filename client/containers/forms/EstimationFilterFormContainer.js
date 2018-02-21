import {connect} from 'react-redux'
import {EstimationFilterForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {getFormValues} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values", formValues)
        dispatch(A.addFilteredEstimation(formValues))
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => ({

    loggedInUser: state.user.loggedIn,
    initialValues: {
        "repository": state.estimation.repository,
        "estimator": state.estimation.estimator,
        "negotiator": state.estimation.negotiator,
        "changeRequested": state.estimation.changeRequested,
        "grantPermission": state.estimation.grantPermission,
        "suggestions": state.estimation.suggestions,
    }


})

const EstimationFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFilterForm)

export default EstimationFilterFormContainer