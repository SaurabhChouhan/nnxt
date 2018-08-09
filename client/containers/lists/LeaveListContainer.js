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
        dispatch(A.leaveSelected(leave))
        dispatch(A.showComponentHideOthers(COC.LEAVE_DETAIL_PAGE))
    },

    revokeLeave: (leave) => dispatch(A.deleteLeaveFromServer(leave._id)).then(json => {
        if (json.success) {
            NotificationManager.success('Leave deleted successfully')
        } else {
            NotificationManager.error('Leave deletion failed')
        }
        return json
    }),

    changeLeaveStatus: (status) => dispatch(A.getAllLeavesFromServer(status)),

    approveLeave: (leave) => {
        dispatch(A.leaveSelected(leave))
        dispatch(A.showComponent(COC.LEAVE_APPROVE_DIALOG))
    },

    cancelLeave: (leave) => {
        dispatch(A.leaveSelected(leave))
        dispatch(A.showComponent(COC.LEAVE_REJECT_DIALOG))
    }
})


const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn,
    leaves: state.leave && state.leave.all && Array.isArray(state.leave.all) && state.leave.all.length ? state.leave.all : []
})

const LeaveListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveList)

export default LeaveListContainer