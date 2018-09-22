import {connect} from 'react-redux'
import {TaskReportDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportGoBack: (event) => {
        dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_SECTION))

    }
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.report.reportTaskDetail.taskPlan,
    release: state.report.reportTaskDetail.release,
    releasePlan: state.report.reportTaskDetail.releasePlan,
    taskPlans: state.report.reportTaskDetail.taskPlans
})

const TaskReportDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskReportDetailPage)

export default TaskReportDetailPageContainer