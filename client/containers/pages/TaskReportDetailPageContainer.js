import {connect} from 'react-redux'
import {TaskReportDetailPage} from '../../components/index'
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'

const mapDispatchToProps = (dispatch, ownProps) => ({
    ReportGoBack: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))
                dispatch(A.getReleaseForDashboard(release._id))
            }
        })


    }
})

const mapStateToProps = (state, ownProps) => ({
    taskPlan: state.report.taskPlan,
    release: state.report.release,
    releasePlan: state.report.releasePlan,
    taskPlans: state.release.taskPlans,

})

const TaskReportDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskReportDetailPage)

export default TaskReportDetailPageContainer