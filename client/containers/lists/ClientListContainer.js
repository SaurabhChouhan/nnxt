import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {connect} from "react-redux";
import {ClientList} from "../../components";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showClientCreationForm: () => {

        dispatch(A.showComponent(COC.CLIENT_FORM_DIALOG))
    },
    showClientEditForm: (client) => {
        //dispatch(A.getAllClientsFromServer()),
        dispatch(A.showComponent(COC.CLIENT_FORM_DIALOG)),
            dispatch(initialize('client', client))
    },
    deleteClient: (clientID) => dispatch(A.deleteClientOnServer(clientID)).then(json => {
        if (json.success) {
            NotificationManager.success('Client Removed Successfully')
        } else {
            NotificationManager.error(json.message)
            throw new SubmissionError({client: "Client Removal Failed"})
        }
    }),
    toggleIsActive: (clientID) => {
        console.log("clientID",clientID)
        dispatch(A.toggleClientIsActive(clientID))
    },
    filterClient: (value) =>{
        console.log("fetchClient", value)
        dispatch(A.searchClientOnServer(value))
    }

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