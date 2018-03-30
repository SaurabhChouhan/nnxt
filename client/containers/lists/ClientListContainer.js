import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import {ClientList} from "../../components";
import {showComponent} from "../../actions";
import {initialize, SubmissionError} from "redux-form";
import {CLIENT_FORM_DIALOG} from "../../components/componentConsts";
import {deleteClientOnServer} from "../../actions";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showClientCreationForm: () => {

        dispatch(A.showComponent(COC.CLIENT_FORM_DIALOG))
    },
    showClientEditForm: (client) => {
        //dispatch(A.getAllClientsFromServer()),
        dispatch(showComponent(CLIENT_FORM_DIALOG)),
            dispatch(initialize('client', client))
    },
    deleteClient: (clientID) => dispatch(deleteClientOnServer(clientID)).then(json => {
        if (json.success) {
            NotificationManager.success('Client Removed Successfully')
        } else {
            NotificationManager.error('Client Not removed!')
            throw new SubmissionError({client: "Client Removal Failed"})
        }
    }),

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        clients: state.client.all
    }
}

const ClientListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientList)

export default ClientListContainer