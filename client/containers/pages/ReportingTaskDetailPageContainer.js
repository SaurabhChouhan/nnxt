
import {connect} from 'react-redux'
import {ReportingTaskDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'


const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportingGoBack: (event) => dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))
})

const mapStateToProps = (state, ownProps) => ({
    selectedTaskPlan: state.report.selectedTaskPlan,
    selectedRelease: state.report.selectedRelease,
    selectedReleasePlan: state.report.selectedReleasePlan
})

const ReportingTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskDetailPage)

export default ReportingTaskDetailPageContainer