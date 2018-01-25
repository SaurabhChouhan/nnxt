import {connect} from 'react-redux'
import {ClientForm} from "../../components"
import * as logger from '../../clientLogger'
import {addClientOnServer} from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(addClientOnServer(values))
    }
})

const mapStateToProps = (state, ownProps) => ({})

const ClientFormContainer = connect(
    null,
    mapDispatchToProps
)(ClientForm)

export default ClientFormContainer