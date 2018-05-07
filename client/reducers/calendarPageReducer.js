import moment from 'moment'

let now = new Date()

const calendarPageReducer = (state = {
    events: [],
    visibility: {calendarView: true},
    selectedTaskDetail: {},
    defaultView: "week",
    defaultDate: moment(now).toDate(),
    selectedView: "week",
    selectedDate: moment(now).toDate(),
    fetchInProgress: false,

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
            return Object.assign({}, state,
                {
                    selectedView: (action.view == null) ? state.defaultView : action.view,
                    selectedDate: (action.date == null) ? state.defaultDate : action.date
                }
            )
        default:
            return state;
    }
}
export default calendarPageReducer;
