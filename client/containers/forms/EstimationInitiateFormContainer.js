import {connect} from 'react-redux'
import {EstimationInitiateForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        logger.debug(logger.ESTIMATION_INITIATE_FORM_SUBMIT, "values:", values)
        if (values._id) {
            return dispatch(A.updateEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Estimation Updated Successfully")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_INITIATE_DIALOG))
                } else {
                    NotificationManager.error("Estimation update Failed")
                }
            })
        }
        else {
            return dispatch(A.initiateEstimationOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Estimation Initiated Successfully")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_INITIATE_DIALOG))
                } else {
                    NotificationManager.error("Estimation Initiation Failed")
                }
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    estimators: state.user.all && Array.isArray(state.user.all) && state.user.all.length ? state.user.all.filter(user =>
        state.user && state.user.loggedIn && state.user.loggedIn._id && user._id.toString() !== state.user.loggedIn._id.toString() && user.roles && user.roles.length ? user.roles.findIndex(r => r.name === SC.ROLE_ESTIMATOR) != -1 : false
    ) : [],
    projects: state.project.all,
    technologies: state.technology.all,
    developmentTypes: state.developmentType.all,
    modules: state.module.all
})

const EstimationInitiateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationInitiateForm)

export default EstimationInitiateFormContainer