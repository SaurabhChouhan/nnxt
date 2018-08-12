import {connect} from 'react-redux'
import {LeaveRequestForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        return dispatch(A.addLeaveRequestOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success('leave Request Added Successfully')
                dispatch(A.hideComponent(COC.LEAVE_REQUEST_FORM_DIALOG))

            } else {
                NotificationManager.error(json.message)
            }
            return json
        })


    }
})

const mapStateToProps = (state, ownProps) => ({
    leaveTypes: state.leave.leaveTypes
})

const LeaveRequestFormCOntainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveRequestForm)

export default LeaveRequestFormCOntainer