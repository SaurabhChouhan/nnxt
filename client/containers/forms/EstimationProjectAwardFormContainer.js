import {connect} from 'react-redux'
import {EstimationProjectAwardForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'

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
const mapStateToProps = (state) => {

    let Managers = []
    let Leaders = []


    if (state.user.all && Array.isArray(state.user.all) && state.user.all.length > 0) {
        // Users who has role as a manager or leader or both
        Managers = state.user.all.filter(user => user.roles.find((role) => {
            role.name = SC.ROLE_MANAGER
        }))
        Leaders = state.user.list.filter(user => user.roles.find((role) => {
            role.name = SC.ROLE_LEADER
        }))
    }

    return {
        all: state.user.all,
        Managers,
        Leaders
    }
}

const EstimationProjectAwardFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationProjectAwardForm)

export default EstimationProjectAwardFormContainer