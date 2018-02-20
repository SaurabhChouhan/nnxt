import {connect} from 'react-redux'
import {EstimationFilterForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values",formValues)
        dispatch(A.addFilteredEstimation(formValues))
        dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => ({

    loggedInUser: state.user.loggedIn,
    features: state.estimation.features,

})

const EstimationFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationFilterForm)

export default EstimationFilterFormContainer