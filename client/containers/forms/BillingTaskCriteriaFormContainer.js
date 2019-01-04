import { connect } from 'react-redux'
import { BillingTaskCriteriaForm } from "../../components"
import { getReleasesOfClientFromServer, addClientReleases } from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
    clientSelected: (clientID) => {
        dispatch(getReleasesOfClientFromServer(clientID)).then(json => {
            dispatch(addClientReleases(json.data.client, json.data.releases))
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.client.billable,
    releases: state.billing.clientReleases,
    client: state.billing.selectedClient
})

const BillingTaskCriteriaFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingTaskCriteriaForm)

export default BillingTaskCriteriaFormContainer