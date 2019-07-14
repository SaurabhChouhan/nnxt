import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { addBillingProjects, addBillingTaskCriteria, getInReviewBillingPlansFromServer, addInReviewBillingPlans, getBillingClientsFromServer, addBillingClients, getBillingReleasesOfClientFromServer, addBillingReleases, showLoader, hideLoader, clearInReviewBillingPlans, getBillingProjectsFromServer } from '../../actions'
import { change, getFormValues } from 'redux-form'
import moment from 'moment'

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
        // don't use date criterias to find biling projects
        dispatch(getBillingProjectsFromServer({
            clientID: criteria.clientID
        })).then(json => {
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

const mapStateToProps = (state, ownProps) => {
    let billingCriteriaValues = getFormValues('billing-task-criteria')(state)
    console.log("billing criteria values ", billingCriteriaValues)
    let maxStartDate = undefined
    let minEndDate = undefined
    if (billingCriteriaValues && billingCriteriaValues.fromDate) {
        minEndDate = moment(billingCriteriaValues.fromDate).toDate()
    }
    if (billingCriteriaValues && billingCriteriaValues.toDate) {
        maxStartDate = moment(billingCriteriaValues.toDate).toDate()
    }

    return {
        maxStartDate,
        minEndDate,
        clients: state.billing.billingClients,
        releases: state.billing.billingReleases,
        client: state.billing.selectedClient,
        criteria: state.billing.billingTaskCriteria
    }
}

const BillingTaskCriteriaFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskCriteriaForm)

export default BillingTaskCriteriaFormContainer