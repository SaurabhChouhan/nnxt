import {connect} from 'react-redux'
import {ReportingTaskPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'


const mapDispatchToProps = (dispatch, ownProps) => ({
    onReleaseSelect: (releaseID, date, status) => {
        if (!releaseID) {
            return NotificationManager.error("Please select Project")
        }

        else {
            dispatch(A.getReleaseDetailsForReporting(releaseID))
            dispatch(A.getReportingTasksForDate(releaseID, date, status))
        }
    },
    setStatus: (status) => dispatch(A.setStatus(status)),
    taskSelected: (task, selectedRelease) => dispatch(A.getTaskDetailsForReportFromServer(task._id, selectedRelease._id)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_DETAIL_PAGE))
    },
    reportTask: (task, date) => {
        let inputTask = {
            _id: task._id,
            reason: task.reason,
            reportedHours: parseInt(task.reportedHours),
            status: task.status,
            reportedDate: date
        }
        dispatch(A.reportTaskToServer(inputTask)).then((json) => {
            if (json.success)
                NotificationManager.success('Task report submitted.')
            else
                NotificationManager.error('Task report failed!!!')
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    allReleases: state.report.allReleases,
    releases: state.report.availableReleases,
    dateOfReport: state.report.dateOfReport,
    releaseID: state.report.releaseID,
    reportedStatus: state.report.reportedStatus
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer