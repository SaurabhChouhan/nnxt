import { connect } from 'react-redux'
import { ReleaseTaskPlanningPage } from '../../components'
import { initialize } from 'redux-form'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import { NotificationManager } from 'react-notifications'
import * as SC from '../../../server/serverconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({

    showTaskPlanningCreationForm: (releasePlan, workCalendarEmployeeIDs) => {
        dispatch(initialize("task-planning", {
            release: releasePlan.release,
            task: releasePlan.task,
            releasePlan: {
                _id: releasePlan._id,
            },
            projectUsersOnly: true,
            workCalendarEmployeeIDs

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

    deleteTaskPlanningRow: (plan, workCalendarEmployeeIDs) => dispatch(A.deleteTaskPlanningFromServer(plan._id)).then(json => {
        if (json.success) {
            NotificationManager.success("Task Planning Deleted")
            if (workCalendarEmployeeIDs.indexOf(plan.employee._id.toString()) > -1) {
                if (workCalendarEmployeeIDs.length > 1) {
                    // issue fetch for all release employees
                    dispatch(A.getEmployeeWorkCalendarFromServer(SC.ALL, null, null, plan.release._id))
                }
                else
                    dispatch(A.getEmployeeWorkCalendarFromServer(plan.employee._id))
            }
        }
        else {
            NotificationManager.error(json.message)
        }
    }),
    reopenTask: (task) => {
        dispatch(A.reopenTaskPlanOnServer(task._id))

    },
    markAsComplete: (releasePlan) => {
        dispatch(A.markReleasePlanAsCompleteOnServer(releasePlan._id)).then(json => {
            if (json.success) {
                dispatch(A.getAllTaskPlannedFromServer(releasePlan._id))
                NotificationManager.success("Whole Release-task is marked as 'Complete'")
            } else {
                NotificationManager.error(json.message)
            }
        })
    },
    openMoveTaskPlanForm: (taskPlan, workCalendarEmployeeIDs) => {
        taskPlan.workCalendarEmployeeIDs = workCalendarEmployeeIDs
        dispatch(A.getIterationDatesReleasePlansFromServer(taskPlan.releasePlan._id)).then(() => {
            dispatch(initialize("move-task-planning", taskPlan))
            dispatch(A.showComponent(COC.MOVE_TASK_PLAN_DIALOG))
        })
    },
    ReleaseTaskGoBack: (release) => {
        dispatch(A.showComponentHideOthers(COC.RELEASE_PLAN_SECTION))
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
    addDescription: (flag) => dispatch(A.addDescriptionInTable(flag)),

})


const mapStateToProps = (state) => ({
    release: state.release.selectedRelease,
    releasePlan: state.release.selectedReleasePlan,
    taskPlans: state.release.taskPlans,
    developerPlans: state.release.developerPlans,
    developers: [{
        _id: 'all',
        name: 'All Employees'
    }, ...state.release.teamOfRelease],
    expanded: state.release.expanded,
    descriptionFlag: state.release.descriptionFlag,
    workCalendarEmployeeIDs: state.employee.workCalendar.employees && state.employee.workCalendar.employees.length ? state.employee.workCalendar.employees.map(e => e._id) : []
})

const ReleaseTaskPlanningPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningPage)

export default ReleaseTaskPlanningPageContainer
