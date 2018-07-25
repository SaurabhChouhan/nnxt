import {connect} from 'react-redux'
import {ReportingTaskDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportingGoBack: (event) => {
        dispatch(A.getReportingTasksForDate(SC.ALL, U.getNowStringInIndia(), SC.ALL))
        dispatch(A.setReleaseID(SC.ALL))
        dispatch(A.setReportDate(U.getNowStringInIndia()))
        dispatch(A.setReportedStatus(SC.ALL))
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))
    }
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.report.taskPlan,
    release: state.report.release,
    releasePlan: state.report.releasePlan
})

const ReportingTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskDetailPage)

export default ReportingTaskDetailPageContainer