import {connect} from 'react-redux'
import {TaskReportDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportGoBack: (event) => {
        dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))

    }
})

const mapStateToProps = (state, ownProps) => ({
    selectedTaskPlan: state.report.taskPlan,
    selectedRelease: state.report.release,
    selectedReleasePlan: state.report.releasePlan
})

const TaskReportDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskReportDetailPage)

export default TaskReportDetailPageContainer