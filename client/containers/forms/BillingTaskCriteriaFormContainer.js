import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { addBillingTaskCriteria, getInReviewBillingPlansFromServer, addInReviewBillingPlans, getBillingClientsFromServer, addBillingClients, getBillingReleasesOfClientFromServer, addBillingReleases } from '../../actions'

import { change } from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({

    getInReviewBillingPlans: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(getInReviewBillingPlansFromServer(criteria)).then(json => {
            if (json.success)
                dispatch(addInReviewBillingPlans(json.data.release, json.data.releasePlans))
        })

    },
    fetchBillingClients: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(getBillingClientsFromServer(criteria)).then(json => {
            if (json.success) {
                dispatch(addBillingClients(json.data))
                dispatch(change('billing-task-criteria', 'clientID', ''))
            }
        })
    },
    fetchBillingReleases: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(getBillingReleasesOfClientFromServer(criteria)).then(json => {
            dispatch(addBillingReleases(json.data))
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.billing.billingClients,
    releases: state.billing.billingReleases,
    client: state.billing.selectedClient,
    criteria: state.billing.billingTaskCriteria
})

const BillingTaskCriteriaFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskCriteriaForm)

export default BillingTaskCriteriaFormContainer