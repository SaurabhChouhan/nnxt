import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import {ClientList} from "../../components";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showClientCreationForm: () => {

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