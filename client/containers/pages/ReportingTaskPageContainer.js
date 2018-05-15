import {connect} from 'react-redux'
import {ReportingTaskPage} from "../../components/index"
import * as A from '../../actions/index'
import * as COC from '../../components/componentConsts'
import _ from 'lodash'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onProjectSelect: (releaseID, planDate, taskStatus) => {
        console.log("releaseID", releaseID)
        console.log("typeof releaseID", typeof releaseID)
        console.log(" releaseID === Select Project", releaseID === "Select Project")
        console.log("releaseID", releaseID)
        let dummyData = {
            taskPlans: []
        }
        if (!releaseID || _.isEmpty(releaseID) || releaseID === "Select Project" || releaseID === undefined || !planDate && !taskStatus) {
            dispatch(A.noProjectSelected(dummyData))
        } else {
            dispatch(A.getProjectDeatilAndTaskPlanningsFromServer(releaseID, planDate, taskStatus))
        }

    },
    taskSelected: (task, selectedProject) => dispatch(A.getTaskAndProjectDetailsFromServer(task._id, selectedProject._id)),

    setStatus: (status) => dispatch(A.setStatus(status)),

    setProjectId: (releaseId) => dispatch(A.setProjectId(releaseId)),

    showTaskDetailPage: () => {
        dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_DETAIL_PAGE))
    },
    reportTaskPlan: (taskPlan) => {
        console.log("taskPlan", taskPlan)
    }
})

const mapStateToProps = (state, ownProps) => ({
    allProjects:state.report.allProjects,
    selectedProject: state.report.selectedProject,
    allTaskPlans: state.report.allTaskPlans,
    dateOfReport: state.report.dateOfReport,
    releaseID: state.report.releaseID,
    taskStatus: state.report.status,
})

const ReportingTaskPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingTaskPage)

export default ReportingTaskPageContainer