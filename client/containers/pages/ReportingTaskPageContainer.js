import {connect} from 'react-redux'
import {ReportingTaskPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import _ from 'lodash'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReleaseSelect: (releaseID) => {
        dispatch(A.getReleaseDetailsForReporting(releaseID))
    },
    taskSelected: (task, selectedProject) => dispatch(A.getTaskAndProjectDetailsFromServer(task._id, selectedProject._id)),
    setStatus: (status) => dispatch(A.setStatus(status)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_DETAIL_PAGE))
    },
    reportTask: (task) => {
        console.log('taskPlan', taskPlan)
    }
})

const mapStateToProps = (state, ownProps) => ({
    releases: state.report.userReleases,
    selectedRelease: state.report.selectedRelease,
    tasks: state.report.tasksOfSelectedDate,
    dateOfReport: state.report.dateOfReport,
    releaseID: state.report.releaseID,
    taskStatus: state.report.status
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer