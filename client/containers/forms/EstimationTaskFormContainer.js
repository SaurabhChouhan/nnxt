import {connect} from 'react-redux'
import {EstimationTaskForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        logger.debug(logger.ESTIMATION_TASK_FORM_SUBMIT, "values:", values)
    }
})

const mapStateToProps = (state, ownProps) => ({
    estimation: state.estimation.selected
})

const EstimationTaskFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationTaskForm)

export default EstimationTaskFormContainer