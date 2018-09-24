import {connect} from 'react-redux'
import {TaskPlanDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportGoBack: (event) => {
        dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))

    }
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.report.reportTaskDetail.taskPlan,
    release: state.report.reportTaskDetail.release,
    releasePlan: state.report.reportTaskDetail.releasePlan,
    taskPlans: state.report.reportTaskDetail.taskPlans

})

const TaskPlanDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanDetailPage)

export default TaskPlanDetailPageContainer