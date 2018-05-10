import {connect} from 'react-redux'
import {ReportingTaskPage} from "../../components/index"
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onProjectSelect: (releaseID, planDate, taskStatus) => dispatch(A.getProjectDeatilAndTaskPlanningsFromServer(releaseID, planDate, taskStatus)),
    taskSelected: (task) => dispatch(A.taskSelected(task))
})

const mapStateToProps = (state, ownProps) => ({
    allProjects: state.report.allProjects,
    selectedProject: state.report.selectedProject,
    allTaskPlans: state.report.allTaskPlans,
    dateOfReport: state.report.dateOfReport,
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer