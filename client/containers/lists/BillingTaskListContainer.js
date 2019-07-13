import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'
import { BILLING_TASK_DESCRIPTION_DIALOG } from '../../components/componentConsts'
import { showComponent } from '../../actions'
import moment from 'moment'
import {DATE_DISPLAY_FORMAT} from '../../clientconstants'

import { initialize } from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    reviewDescription: (data) => {
        console.log("review description called with data as ", data)
        data.billingDate = moment(data.billedDate).format(DATE_DISPLAY_FORMAT)
        dispatch(initialize('billing-task-description', data))
        dispatch(showComponent(BILLING_TASK_DESCRIPTION_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => {
    let projectTeam = []
    if (state.billing.inReviewBillingRelease) {
        if (state.billing.inReviewBillingRelease.team && state.billing.inReviewBillingRelease.team.length)
            projectTeam = [...state.billing.inReviewBillingRelease.team]

        if (state.billing.inReviewBillingRelease.nonProjectTeam && state.billing.inReviewBillingRelease.nonProjectTeam.length)
            projectTeam = [...projectTeam, ...state.billing.billingRelease.nonProjectTeam]
    }

    return {
        inReviewBillingPlans: state.billing.inReviewBillingPlans,
        projectTeam
    }
}

const BillingTaskListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskList)


export default BillingTaskListContainer