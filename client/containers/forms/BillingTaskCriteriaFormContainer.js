import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { getReleasesOfClientFromServer, addClientReleases, addBillingTaskCriteria, getBillingReleasePlansFromServer, addBillingReleasePlans } from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
    clientSelected: (clientID) => {
        dispatch(getReleasesOfClientFromServer(clientID)).then(json => {
            dispatch(addClientReleases(json.data.client, json.data.releases))
        })
    },
    fetchiBillingTasks: (criteria) => {
        dispatch(addBillingTaskCriteria(criteria))
        if (criteria.clientID && criteria.releaseID && criteria.fromDate) {
            dispatch(getBillingReleasePlansFromServer(criteria)).then(json => {
                if (json.success)
                    dispatch(addBillingReleasePlans(json.data.release, json.data.releasePlans))
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.client.billable,
    releases: state.billing.clientReleases,
    client: state.billing.selectedClient,
    criteria: state.billing.billingTaskCriteria
})

const BillingTaskCriteriaFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskCriteriaForm)

export default BillingTaskCriteriaFormContainer