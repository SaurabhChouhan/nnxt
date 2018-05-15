import moment from 'moment'

let now = new Date()

const calendarPageReducer = (state = {
    events: [],
    selectedTaskDetail: {},
    defaultView: "week",
    defaultDate: moment(now).toDate(),
    selectedView: "week",
    selectedDate: moment(now).toDate(),

}, action) => {
    switch (action.type) {
        case 'SHOW_SELECTED_TASK_DETAIL':
            console.log(" SHOW_SELECTED_TASK_DETAIL ", action.event);
            return Object.assign({}, state,
                {
                    visibility: {
                        calendarView: false,
                    },
                    selectedTaskDetail: action.event
                }
            )

        case 'CHANGE_CALENDAR_NAVIGATION':
            return Object.assign({}, state, {
                selectedView: (action.view == null) ? state.defaultView : action.view,
                selectedDate: (action.date == null) ? state.defaultDate : action.date
            })

        case 'SHOW_CALENDAR_VIEW':
            return Object.assign({}, state, {
                visibility: {
                    calendarView: true,
                }
            })

        case 'SHOW_USERS_TASKS':
            console.log(" SHOW_USERS_TASKS ", action.tasks);

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
