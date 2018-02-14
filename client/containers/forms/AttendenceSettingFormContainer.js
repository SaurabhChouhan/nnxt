import {connect} from 'react-redux'
import {AttendenceSettingForm} from "../../components"
import * as logger from '../../clientLogger'
import {addAttendenceSettingOnServer} from "../../actions"
import {initialize, SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {

        logger.debug(logger.ATTENDENCE_SETTING_FORM_RENDER, "onSubmit:values:", values)
        return dispatch(addAttendenceSettingOnServer(values)).then(json => {
            if (json.success) {
                dispatch(initialize("attendence-setting", json.data))
                NotificationManager.success('Attendence Setting added Successfully')
            } else {
                NotificationManager.error('Attendence Setting  Not Added!')

            }
        })
    }
})

const mapStateToProps = (state, ownProps) => ({})

const AttendenceSettingFormContainer = connect(
    null,
    mapDispatchToProps
)(AttendenceSettingForm)

export default AttendenceSettingFormContainer