import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'
import { showComponent, fetchCurrentDescriptionFromState } from '../../actions'
import moment from 'moment'
import { DATE_DISPLAY_FORMAT } from '../../clientconstants'


const mapDispatchToProps = (dispatch, ownProps) => ({
    reviewDescription: (data) => {
        dispatch(fetchCurrentDescriptionFromState({
            "_id": data._id,
            "billingDate": moment(data.billedDate).format(DATE_DISPLAY_FORMAT),
            "releasePlanName": data.releasePlan.name,
            "employeeName": data.billingEmployee.name
        }))
    },
    saveBillingTask: (data) => {
        console.log("save billing task called ", data)
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