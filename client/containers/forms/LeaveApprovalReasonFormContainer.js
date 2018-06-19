import {connect} from 'react-redux'
import {LeaveApprovelResonForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import {change} from 'redux-form'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    saveIsApproved: (isApproved) => {
        return dispatch(change("leave-approval", "isApproved", isApproved))
    },
    onSubmit: (values) => {
        if (!values.leaveID || !values.reason) {
            console.log("Reason not provided")
        }
        if (values.isApproved) {
            return dispatch(A.approveLeaveRequestFromServer(values.leaveID, values.reason)).then(json => {
                if (json.success) {
                    NotificationManager.success('Leave request Approved Successfully')
                } else {
                    NotificationManager.error('Leave request Approval failed')
                }
                return json
            })
        } else {
            return dispatch(A.cancelLeaveRequestFromServer(values.leaveID, values.reason)).then(json => {
                if (json.success) {
                    NotificationManager.success('Leave request Cancelled Successfully')
                } else {
                    NotificationManager.error('process failed')
                }
                return json
            })

        }


    }
})

const mapStateToProps = (state, ownProps) => ({
    initialValues: {
        "leaveID": state.leave.selected._id
    }
})

const LeaveApprovalReasonFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveApprovelResonForm)

export default LeaveApprovalReasonFormContainer