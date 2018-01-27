import {connect} from 'react-redux'
import {EstimationInitiateForm} from "../../components"
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        //return dispatch(addClientOnServer(values))
    }
})

const mapStateToProps = (state, ownProps) => ({
    users: state.user.all
})

const EstimationInitiateFormContainer = connect(
    null,
    mapDispatchToProps
)(EstimationInitiateForm)

export default EstimationInitiateFormContainer