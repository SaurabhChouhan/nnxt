import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import ClientList from "../../components/lists/ClientList";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showClientCreationForm: () => {
        console.log("show client init form caled")
        dispatch(A.showComponent(COC.CLIENT_FORM_DIALOG))
    },

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