import { connect } from 'react-redux'
import { BillingTaskList } from '../../components'

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const mapStateToProps = (state, ownProps) => {

    let projectTeam = []

    if (state.billing.billingRelease) {
        if (state.billing.billingRelease.team && state.billing.billingRelease.team.length)
            projectTeam = [...state.billing.billingRelease.team]

        if (state.billing.billingRelease.nonProjectTeam && state.billing.billingRelease.nonProjectTeam.length)
            projectTeam = [...projectTeam, ...state.billing.billingRelease.nonProjectTeam]
    }

    return {
        billingReleasePlans: state.billing.billingReleasePlans,
        projectTeam
    }
}

const BillingTaskListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskList)


export default BillingTaskListContainer