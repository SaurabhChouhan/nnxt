import {connect} from 'react-redux'
import {EstimationProjectAwardForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
            logger.debug(logger.ESTIMATION_PROJECT_AWARD_FORM_SUBMIT, "values:", values)
            return dispatch(A.addProjectAwardOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Project Awarded")
                    // hide dialog
                    dispatch(A.hideComponent(COC.ESTIMATION_FEATURE_DIALOG))
                } else {
                    NotificationManager.error("Project Awardation Failed")
                }
            })
    }
})

const mapStateToProps = (state, ownProps) => ({
})

const EstimationProjectAwardFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationProjectAwardForm)

export default EstimationProjectAwardFormContainer