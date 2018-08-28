import {connect} from 'react-redux'
import {ReportingTaskPage} from '../../components/index'
import * as A from '../../actions/index'
import * as SC from '../../../server/serverconstants'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import {initialize} from 'redux-form'


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
    taskPlanSelected: (taskPlan) => dispatch(A.getDataForReportTaskDetailPageFromServer(taskPlan._id)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_DETAIL_PAGE))
    },
    reportTask: (task, date, iterationType) => {
        let reportData = {
            _id: task._id,
            reportedHours: parseFloat(task.reportedHours),
            status: iterationType == SC.ITERATION_TYPE_PLANNED ? task.status : SC.STATUS_PENDING,
            reportedDate: date,
            iterationType: iterationType,
            taskName: task.task.name,
            reportDescription: task.report.description
        }

        dispatch(initialize('report-task-description', reportData))
        dispatch(A.showComponent(COC.REPORT_TASK_DESCRIPTION_DIALOG))


        /*
        return dispatch(A.reportTaskToServer(inputTask)).then((json) => {
            if (json.success) {
                NotificationManager.success('Task report submitted.')
                dispatch(A.taskReported(json.data.taskPlan))
            } else
                NotificationManager.error(json.message)
            return json
        })
        */
    }
})

const mapStateToProps = (state, ownProps) => ({
    allReleases: state.report.allReleases,
    activeReleases: state.report.activeReleases,
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