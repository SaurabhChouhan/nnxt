import {connect} from 'react-redux'
import {ReportingTaskDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportingGoBack: (event) => {
        dispatch(A.getReportingTasksForDate(SC.ALL, U.getNowStringInIndia(), SC.ITERATION_TYPE_PLANNED, SC.ALL))
        dispatch(A.setReleaseID(SC.ALL))
        dispatch(A.setReportDate(U.getNowStringInIndia()))
        dispatch(A.setReportedStatus(SC.ALL))
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))
    }
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.report.reportTaskDetail.taskPlan,
    release: state.report.reportTaskDetail.release,
    releasePlan: state.report.reportTaskDetail.releasePlan,
    taskPlans: state.report.reportTaskDetail.taskPlans
})

const ReportingTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskDetailPage)

export default ReportingTaskDetailPageContainer