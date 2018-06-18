import {connect} from 'react-redux'
import {ReleaseTaskPlanningPage} from '../../components'
import {initialize} from 'redux-form'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from '../../../server/errorcodes'

const mapDispatchToProps = (dispatch, ownProps) => ({

    showTaskPlanningCreationForm: (releasePlan) => {
        dispatch(initialize("task-planning", {
            release: releasePlan.release,
            task: releasePlan.task,
            releasePlan: {
                _id: releasePlan._id,
            },
            projectUsersOnly: true

        }))
        dispatch(A.showComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
    },

    planTask: (taskPlanning) => dispatch(A.addTaskPlanningOnServer(taskPlanning)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Added")
        }
        else NotificationManager.error("Task Planning Failed")
    }),

    deleteTaskPlanningRow: (plan) => dispatch(A.deleteTaskPlanningFromServer(plan._id, plan.releasePlan && plan.releasePlan._id ? plan.releasePlan._id : undefined)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Deleted")
        }
        else {
            if (json.errorCode === EC.NOT_FOUND) {
                return NotificationManager.error(json.message)
            } else if (json.errorCode === EC.ACCESS_DENIED) {
                return NotificationManager.error(json.message)
            } else if (json.errorCode === EC.NOT_ALLOWED_TO_ADD_EXTRA_EMPLOYEE) {
                return NotificationManager.error(json.message)
            } else if (json.errorCode === EC.TIME_OVER) {
                return NotificationManager.error(json.message)
            } else NotificationManager.error("Task Planning Deletion Failed")
        }
    }),

    openMergeTaskPlanningForm: (releasePlan) => {
        dispatch(initialize("merge-task-planning", releasePlan))
        dispatch(A.showComponent(COC.MERGE_TASK_PLANNING_DIALOG))

    },


    planTaskFilter: (taskPlanFilter) => dispatch(A.addTaskPlanningFiltersOnServer(taskPlanFilter)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Added")
        }
        else NotificationManager.error("Task Planning Failed")
    }),

    ReleaseTaskGoBack: (release) => {
        dispatch(A.getReleaseFromServer(release._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_LIST))
            }
        })
        dispatch(A.getReleasePlansFromServer(release._id, 'all', 'all'))
    },

    expandDescription: (flag) => dispatch(A.expandDescription(flag))
})


const mapStateToProps = (state) => ({
    release: state.release.selectedRelease,
    releasePlan: state.release.selectedReleasePlan,
    taskPlans: state.release.taskPlans,
    developerPlans: state.release.developerPlans,
    expanded: state.release.expanded
})

const ReleaseTaskPlanningPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningPage)

export default ReleaseTaskPlanningPageContainer
