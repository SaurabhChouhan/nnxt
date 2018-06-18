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

    deleteLeave: (leave) => dispatch(A.deleteLeaveFromServer(leave._id)).then(json => {
        if (json.success) {
            NotificationManager.success('Leave deleted successfully')
        } else {
            NotificationManager.error('Leave deletion failed')
        }
        return json
    }),

    cancelLeaveRequestCall: (leave) => {
        return dispatch(A.cancelLeaveRequestFromServer(leave._id)).then(json => {
            if (json.success) {
                NotificationManager.success('Leave request Cancelled Successfully')
            } else {
                NotificationManager.error('process failed')
            }
            return json
        })
    },

    approveLeaveRequestCall: (leave) => {
        return dispatch(A.approveLeaveRequestFromServer(leave._id)).then(json => {
            if (json.success) {
                NotificationManager.success('Leave request Approved Successfully')
            } else {
                NotificationManager.error('Leave request Approval failed')
            }
            return json
        })
    },

    changeLeaveStatus: (status) => dispatch(A.getAllLeavesFromServer(status)),


})


const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn,
    leaves: state.leave.all
})

const LeaveListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveList)

export default LeaveListContainer