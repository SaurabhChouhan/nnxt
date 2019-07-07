import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { getReleasesOfClientFromServer, addClientReleases, addBillingTaskCriteria, getBillingReleasePlansFromServer, addBillingReleasePlans, getBillingClientsFromServer, addBillingClients, getBillingReleasesOfClientFromServer, addBillingReleases } from '../../actions'

import { change } from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({

    fetchiBillingTasks: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        if (criteria.clientID && criteria.releaseID && criteria.fromDate) {
            dispatch(getBillingReleasePlansFromServer(criteria)).then(json => {
                if (json.success)
                    dispatch(addBillingReleasePlans(json.data.release, json.data.releasePlans))
            })
        }
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