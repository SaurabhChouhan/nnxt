import {connect} from 'react-redux'
import {LeaveRequestForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("You are in Request initiate Form container ", values)
            return dispatch(A.addLeaveRequestOnServer(values)).then(json=>{
                if (json.success) {
                    NotificationManager.success('Leave Request Added Successfully')
                    dispatch(A.hideComponent(COC.LEAVE_REQUEST_FORM_DIALOG))

                } else {
                    NotificationManager.error('Leave Request Not Added!')
                    if (json.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({name: "Leave Request Already Exists"})
                }
                return json
            })



    }
})

/*const mapStateToProps = (state, ownProps) => ({
    leaveFrom: state.client.all,
    leaveTo: state.project.all,
    reason: undefined,

})*/

const LeaveRequestFormCOntainer = connect(

    mapDispatchToProps
)(LeaveRequestForm)

export default LeaveRequestFormCOntainer