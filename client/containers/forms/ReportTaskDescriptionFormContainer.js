import {connect} from 'react-redux'
import {ReportTaskDescriptionForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from "../../actions"
import {addClientOnServer, editClientOnServer} from "../../actions"
import {formValueSelector, SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (reportData) => {
        console.log("report task description ", reportData)

        dispatch(A.reportTaskToServer(reportData)).then((json) => {
            if (json.success) {
                NotificationManager.success('Task report submitted.')
                dispatch(A.taskReported(json.data.taskPlan))
                dispatch(A.hideComponent(COC.REPORT_TASK_DESCRIPTION_DIALOG))
            } else
                NotificationManager.error(json.message)
            return json
        })
    }
})

const selector = formValueSelector('report-task-description')

const mapStateToProps = (state, ownProps) => ({
    taskName: selector(state, 'taskName'),
    status: selector(state, 'status')
})

const ReportTaskDescriptionFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportTaskDescriptionForm)

export default ReportTaskDescriptionFormContainer