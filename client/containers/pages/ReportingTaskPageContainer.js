import {connect} from 'react-redux'
import {ReportingTaskPage} from '../../components/index'
import * as A from '../../actions/index'
import * as SC from '../../../server/serverconstants'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'


const mapDispatchToProps = (dispatch, ownProps) => ({
    setReleaseID: (releaseID, date, iterationType, reportedStatus) => {
        dispatch(A.setReleaseID(releaseID))
        dispatch(A.getReportingTasksForDate(releaseID, date, iterationType, reportedStatus))
    },
    setReportedStatus: (releaseID, date, iterationType, reportedStatus) => {
        dispatch(A.setReportedStatus(reportedStatus))
        dispatch(A.getReportingTasksForDate(releaseID, date, iterationType, reportedStatus))
    },
    setIterationType: (releaseID, date, iterationType, reportedStatus) => {
        dispatch(A.setIterationType(iterationType))
        dispatch(A.getReportingTasksForDate(releaseID, date, iterationType, reportedStatus))
    },
    taskPlanSelected: (taskPlan) => dispatch(A.getTaskDetailsForReportFromServer(taskPlan._id)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_DETAIL_PAGE))
    },
    reportTask: (task, date, iterationType) => {
        let inputTask = {
            _id: task._id,
            reason: task.reason,
            reportedHours: parseInt(task.reportedHours),
            status: iterationType == SC.ITERATION_TYPE_PLANNED ? task.status : SC.STATUS_PENDING,
            reportedDate: date,
            iterationType: iterationType
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
    reportedStatus: state.report.reportedStatus,
    iterationType: state.report.iterationType
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer