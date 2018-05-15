import moment from 'moment'
import * as AC from '../actions/actionConsts'

let now = new Date()

const calendarPageReducer = (state = {
    events: [],
    selectedTask: {},
    selectedProject: {},
    selectedReleasePlan: {},
    defaultView: "week",
    defaultDate: moment(now).toDate(),
    selectedView: "week",
    selectedDate: moment(now).toDate(),

}, action) => {
    switch (action.type) {

        case AC.CHANGE_CALENDAR_NAVIGATION:
            return Object.assign({}, state, {
                selectedView: (action.view == null) ? state.defaultView : action.view,
                selectedDate: (action.date == null) ? state.defaultDate : action.date
            })

        case AC.SET_TASK_AND_PROJECT_DETAILS:
            return Object.assign({}, state, {
                selectedProject: Object.assign({}, action.project, {
                    taskPlan: undefined,
                    releasePlan: undefined
                }),
                selectedTask: action.project.taskPlan,
                selectedReleasePlan: action.project.releasePlan
            })

        case AC.SHOW_USERS_TASKS:
            return Object.assign({}, state, {
                events: action.tasks && Array.isArray(action.tasks) && action.tasks.length ? action.tasks.map(task => {
                    let plannedHours = task.planning && task.planning.plannedHours ? Number(task.planning.plannedHours) : 0
                    task.start = moment(task.planningDateString).clone().add(10, "hours").toDate()
                    task.end = moment(task.start).clone().add(plannedHours, "hours").toDate()
                    task.title = task.task && task.task.name ? task.task.name : 'task'
                    //  task.start = task.start.toDate
                    //  task.end = task.end.toDate
                    return task
                }) : []
            })

        default:
            return state;
    }
}
export default calendarPageReducer;
