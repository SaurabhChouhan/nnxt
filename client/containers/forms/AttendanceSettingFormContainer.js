import {connect} from 'react-redux'
import {AttendenceSettingForm} from "../../components"
import * as logger from '../../clientLogger'
import {initialize, SubmissionError} from "redux-form"
import * as EC from "../../../server/errorcodes"
import {NotificationManager} from "react-notifications"
import * as COC from "../../components/componentConsts"
import * as A from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {

        logger.debug(logger.ATTENDENCE_SETTING_FORM_RENDER, "onSubmit:values:", values)
        return dispatch(A.addAttendanceSettingOnServer(values)).then(json => {
            if (json.success) {
                dispatch(initialize("attendance-setting", json.data))
                NotificationManager.success('Attendance Setting added Successfully')
            } else {
                NotificationManager.error('Attendance Setting  Not Added!')

            }
        })
    }
})

const mapStateToProps = (state, ownProps) => ({})

const AttendanceSettingFormContainer = connect(
    null,
    mapDispatchToProps
)(AttendenceSettingForm)

export default AttendanceSettingFormContainer