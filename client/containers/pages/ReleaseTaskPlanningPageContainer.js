import {connect} from 'react-redux'
import {ReleaseTaskPlanningPage} from '../../components'
import {initialize} from 'redux-form'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from '../../../server/errorcodes'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({

    showTaskPlanningCreationForm: (releasePlan, workCalendarEmployeeID) => {
        dispatch(initialize("task-planning", {
            release: releasePlan.release,
            task: releasePlan.task,
            releasePlan: {
                _id: releasePlan._id,
            },
            projectUsersOnly: true,
            workCalendarEmployeeID

        }))
        dispatch(A.showComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
    },

    planTask: (taskPlanning) => dispatch(A.addTaskPlanningOnServer(taskPlanning)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Added")
        }
        else
            NotificationManager.error(json.message)
    }),

    deleteTaskPlanningRow: (plan, workCalendarEmployeeID) => dispatch(A.deleteTaskPlanningFromServer(plan._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Deleted")
            if (workCalendarEmployeeID && plan.employee._id.toString() == workCalendarEmployeeID.toString())
                dispatch(A.getEmployeeWorkCalendarFromServer(workCalendarEmployeeID))
        }
        else {
            NotificationManager.error(json.message)
        }
    }),
    reopenTask: (task) => {
        dispatch(A.reopenTaskPlanOnServer(task._id))

    },
    openMoveTaskPlanForm: (taskPlan, workCalendarEmployeeID) => {
        taskPlan.workCalendarEmployeeID = workCalendarEmployeeID
        dispatch(A.getIterationDatesReleasePlansFromServer(taskPlan.releasePlan._id)).then(()=>{
            dispatch(initialize("move-task-planning", taskPlan))
            dispatch(A.showComponent(COC.MOVE_TASK_PLAN_DIALOG))
        })
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
        dispatch(A.getReleasePlansFromServer(release._id, SC.ALL, SC.ALL))
    },
    expandDescription: (flag) => dispatch(A.expandDescription(flag)),
    refreshSelectedTaskPlan: (releasePlan, role) => {
        dispatch(A.getReleasePlanDetailsFromServer(releasePlan._id)).then(json => {
            if (json.success) {
                dispatch(A.showComponentHideOthers(COC.RELEASE_TASK_PLANNING_PAGE))
            }
        })
        dispatch(A.getAllTaskPlannedFromServer(releasePlan._id))
        if (role === SC.ROLE_MANAGER) {
            // get all developers from user list when user role in this release is manager
            dispatch(A.getAllDeveloperFromServer())
        } else if (role === SC.ROLE_LEADER) {
            // get project developers from user list when user role in this release is leader
            dispatch(A.getReleaseDevelopersFromServer(releasePlan._id))
        }
    },
})


const mapStateToProps = (state) => ({
    release: state.release.selectedRelease,
    releasePlan: state.release.selectedReleasePlan,
    taskPlans: state.release.taskPlans,
    developerPlans: state.release.developerPlans,
    expanded: state.release.expanded,
    workCalendarEmployeeID: state.employee.workCalendar.employees && state.employee.workCalendar.employees.length ? state.employee.workCalendar.employees[0]._id : undefined
})

const ReleaseTaskPlanningPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningPage)

export default ReleaseTaskPlanningPageContainer
