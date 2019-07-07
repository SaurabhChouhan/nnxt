import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'

const mapDispatchToProps = (dispatch, ownProps) => ({

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