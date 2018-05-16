import {connect} from 'react-redux'
import {ReleaseTaskPlanningPage} from '../../components'
import {initialize} from 'redux-form'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import * as SC from '../../../server/serverconstants'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({

    showTaskPlanningCreationForm: (releasePlan, projectUsersOnly) => {
        if (projectUsersOnly) {
            dispatch(A.getUsersWithRoleDeveloperFromServer())
        } else {
            dispatch(A.getUsersWithRoleCategoryFromServer())
        }
        dispatch(initialize("task-planning", {
            release: releasePlan.release,
            task: releasePlan.task,
            releasePlan: {
                _id: releasePlan._id,
            },
            projectUsersOnly: projectUsersOnly,
            flags: SC.REPORT_UNREPORTED,
            report: {
                status: SC.REPORT_PENDING
            }

        }))
        dispatch(A.showComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
    },

    planTask: (taskPlanning) => dispatch(A.addTaskPlanningOnServer(taskPlanning)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Added")
        }
        else NotificationManager.error("Task Planning Failed")
    }),

    deleteTaskPlanningRow: (plan) => dispatch(A.deleteTaskPlanningFromServer(plan._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Deleted")
        }
        else NotificationManager.error("Task Planning Deletion Failed")
    }),

    openMergeTaskPlanningForm: (releasePlan) => {
        console.log("releasePlan", releasePlan)
        dispatch(initialize("merge-task-planning", releasePlan))
        dispatch(A.showComponent(COC.MERGE_TASK_PLANNING_DIALOG))

    },


    planTaskFilter: (taskPlanFilter) => dispatch(A.addTaskPlanningFiltersOnServer(taskPlanFilter)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Added")
        }
        else NotificationManager.error("Task Planning Failed")
    }),

    ReleaseTaskGoBack: (event) => dispatch(A.showComponentHideOthers(COC.RELEASE_PROJECT_TASK_LIST)),
    expandDescription: (flag) => dispatch(A.expandDescription(flag))
})


const mapStateToProps = (state) => ({
    taskPlan: state.release.selectedTask,
    taskPlans: state.release.taskPlans,
    developerPlans: state.release.developerPlans,
    data: [],
    expanded:state.release.expanded
})

const ReleaseTaskPlanningPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningPage)

export default ReleaseTaskPlanningPageContainer
