import {connect} from 'react-redux'
import {EstimationInitiateForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        logger.debug(logger.ESTIMATION_INITIATE_FORM_SUBMIT, "values:", values)
        return dispatch(A.initiateEstimationOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success("Estimation Initiated Successfully")
                // hide dialog
                dispatch(A.hideComponent(COC.ESTIMATION_INITIATE_DIALOG))
            } else {
                <NotificationManager className="error"/>("Estimation Initiation Failed")
            }
        })

    }
})

const mapStateToProps = (state, ownProps) => ({
    estimators: state.user.all,
    projects: state.project.all,
    technologies: state.technology.all.map(t=> t.name)
})

const EstimationInitiateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationInitiateForm)

export default EstimationInitiateFormContainer