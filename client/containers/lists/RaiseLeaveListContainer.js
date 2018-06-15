import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {connect} from "react-redux";
import RaiseLeaveList from "../../components/lists/RaiseLeaveList";
import {NotificationManager} from "react-notifications";


const mapDispatchToProps = (dispatch, ownProps) => ({
    showRaiseLeaveForm: () => {
        dispatch(A.showComponent(COC.LEAVE_REQUEST_FORM_DIALOG))
    },

    showRaiseLeaveDetail: (leave) => {
        dispatch(A.selectRaiseLeave(leave))
        dispatch(A.showComponent(COC.LEAVE_DETAIL_DIALOG))
    },

    cancelRaiseLeaveRequestCall: (leave) => {
        return dispatch(A.cancelLeaveRequestFromServer(leave._id)).then(json => {
            if (json.success) {
                NotificationManager.success('Leave request Cancelled Successfully')
            } else {
                NotificationManager.error('process failed')
            }
            return json

        })
    },
    deleteRaiseLeaveRequestCall: (leave) => dispatch(A.deleteLeaveRequestFromServer(leave._id)).then(json => {
        if (json.success) {
            NotificationManager.success('Leave request Cancelled Successfully')
        } else {
            NotificationManager.error('process failed')
        }
        return json
    }),

    changeLeaveStatus: (status) => dispatch(A.getAllLeavesFromServer(status)),


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