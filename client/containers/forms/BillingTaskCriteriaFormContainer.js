import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { addBillingProjects, addBillingTaskCriteria, getInReviewBillingPlansFromServer, addInReviewBillingPlans, getBillingClientsFromServer, addBillingClients, getBillingReleasesOfClientFromServer, addBillingReleases, showLoader, hideLoader, clearInReviewBillingPlans, getBillingProjectsFromServer } from '../../actions'

import { change } from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchBillingClients: () => {
        dispatch(getBillingClientsFromServer()).then(json => {
            if (json.success) {
                dispatch(addBillingClients(json.data))
                dispatch(change('billing-task-criteria', 'clientID', ''))
                dispatch(change('billing-task-criteria', 'releaseID', ''))
            }
        })
    },
    fetchBillingProjects: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(getBillingProjectsFromServer(criteria)).then(json => {
            console.log("fetch billing projects ", json.data)
            if (json.success) {
                dispatch(addBillingProjects(json.data))
            }
        })
    },
    fetchBillingReleases: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(getBillingReleasesOfClientFromServer(criteria)).then(json => {
            dispatch(addBillingReleases(json.data))
            dispatch(change('billing-task-criteria', 'releaseID', ''))
        })
    },
    getInReviewBillingPlans: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        dispatch(showLoader())
        dispatch(clearInReviewBillingPlans())
        dispatch(getInReviewBillingPlansFromServer(criteria)).then(json => {
            if (json.success)
                dispatch(addInReviewBillingPlans(json.data.release, json.data.releasePlans))
            dispatch(hideLoader())
        })
    },
    addBillingTaskCriteria: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
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