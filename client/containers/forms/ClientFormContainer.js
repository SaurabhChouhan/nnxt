import {connect} from 'react-redux'
import {ClientForm} from "../../components"
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        logger.debug(logger.CLIENT_FORM_CONNECT, "onSubmit: values ", values)
    }
})

const mapStateToProps = (state, ownProps) => ({})

const ClientFormContainer = connect(
    null,
    mapDispatchToProps
)(ClientForm)

export default ClientFormContainer