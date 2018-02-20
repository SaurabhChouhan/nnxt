import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import RaiseLeaveList from "../../components/lists/RaiseLeaveList";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";


const mapDispatchToProps = (dispatch, ownProps) => ({
    showRaiseLeaveForm: () => {
        dispatch(A.showComponent(COC.LEAVE_REQUEST_FORM_DIALOG))
    },

    showRaiseLeaveDetail: (leave) => {
        dispatch(A.selectRaiseLeave(leave))
        dispatch(A.showComponent(COC.LEAVE_DETAIL_DIALOG))
    },

    cancelRaiseLeaveRequestCall: (data) => {
        return dispatch(A.cancelLeaveRequestFromServer(data)).then(json => {
            if (json.success) {
                NotificationManager.success('Leave request Cancelled Successfully')
            } else {
                NotificationManager.error('process failed')
            }
            return json

        })
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