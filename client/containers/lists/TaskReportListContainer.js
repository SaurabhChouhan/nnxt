import {connect} from 'react-redux'
import * as A from '../../actions'
import {TaskReportList} from "../../components"
import * as COC from '../../components/componentConsts'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    taskPlanSelected: (taskPlan) => dispatch(A.getDataForReportTaskDetailPageFromServer(taskPlan._id)),
    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.TASK_REPORT_DETAIL_PAGE))
    },
    getAllTaskReports: (release) => {
        //dispatch(A.getAllTaskPlansOfThisReleaseFromServer(release._id))
        dispatch(A.getTaskReportsReleasePlanPage(release._id))
    },
    showNotification: (message, type) => {
        if(!type)
            NotificationManager.success(message)
        else if(type=='success')
            NotificationManager.success(message)
        else if(type=='error')
            NotificationManager.error(message)
    }
})

const mapStateToProps = (state) => ({
    reports: state.report.releasesReports,
    expandDescription: state.release.expandDescriptionTaskReportList,
    screenWidth: state.app.screenWidth,
    screenHeight: state.app.screenHeight
})

const TaskReportListContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskReportList))

export default TaskReportListContainer