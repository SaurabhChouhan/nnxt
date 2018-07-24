import {connect} from 'react-redux'
import {ReportingTaskPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'


const mapDispatchToProps = (dispatch, ownProps) => ({
    setReleaseID: (releaseID, date, reportedStatus) => {
        dispatch(A.setReleaseID(releaseID))
        dispatch(A.getReportingTasksForDate(releaseID, date, reportedStatus))
    },

    setStatus: (releaseID, date, reportedStatus) => {
        dispatch(A.setStatus(reportedStatus))
        dispatch(A.getReportingTasksForDate(releaseID, date, reportedStatus))
    },

    taskPlanSelected: (taskPlan) => dispatch(A.getTaskDetailsForReportFromServer(taskPlan._id)),

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
    dateOfReport: state.report.dateStringOfReport,
    releaseID: state.report.releaseID,
    reportedStatus: state.report.reportedStatus
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer