import {connect} from 'react-redux'
import {ClientForm} from "../../components"
import * as logger from '../../clientLogger'
import {addClientOnServer} from "../../actions"
import {SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(addClientOnServer(values)).then(json=>{
            if (json.success) {
                NotificationManager.success('Client Added Successfully')
                dispatch(A.hideComponent(COC.CLIENT_FORM_DIALOG))

            } else {
                NotificationManager.error('Client Not Added!')
                if (json.code == EC.ALREADY_EXISTS)
                    throw new SubmissionError({name: "Client Already Exists"})
            }
            return json
        })
    }
})

const mapStateToProps = (state, ownProps) => ({

})

const ClientFormContainer = connect(
    null,
    mapDispatchToProps
)(ClientForm)

export default ClientFormContainer