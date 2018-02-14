import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import RaiseLeaveList from "../../components/lists/RaiseLeaveList";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";
import {showComponentHideOthers, showComponent} from "../../actions";
import {PROJECT_FORM_DIALOG} from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showRaiseLeaveForm: () => {
        console.log("show showRaiseLeaveForm init form caled")
        //dispatch(A.getAllClientsFromServer()),
        dispatch(A.showComponent(COC.LEAVE_REQUEST_FORM_DIALOG))
    },
    cancelRaiseLeaveRequestCall: (data) => {
        //dispatch(A.getAllClientsFromServer()),
        console.log("show showRaiseLeaveForm init form caled", data)
        //return dispatch(A.cancelLeaveRequestFromServer(id))
    }

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        leaveRequests: state.leaveRequest.all
    }
}

const RaiseLeaveListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RaiseLeaveList)

export default RaiseLeaveListContainer