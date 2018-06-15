import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {connect} from "react-redux";
import {LeaveList} from "../../components";
import {NotificationManager} from "react-notifications";


const mapDispatchToProps = (dispatch, ownProps) => ({
    showRaiseLeaveForm: () => {
        dispatch(A.showComponent(COC.LEAVE_REQUEST_FORM_DIALOG))
    },

    showLeaveDetails: (leave) => {
        dispatch(A.selectLeave(leave))
        dispatch(A.showComponent(COC.LEAVE_DETAIL_DIALOG))
    },

    deleteRaiseLeaveRequestCall: (leave) => dispatch(A.deleteLeaveRequestFromServer(leave._id)).then(json => {
        if (json.success) {
            NotificationManager.success('Leave deleted successfully')
        } else {
            NotificationManager.error('Leave deletion failed')
        }
        return json
    }),

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


})


const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn,
    leaveRequests: state.leaveRequest.all
})

const LeaveListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveList)

export default LeaveListContainer