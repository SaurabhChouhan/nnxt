import moment from 'moment'
import * as AC from '../actions/actionConsts'
import * as U from '../../server/utils'

let now = new Date()

const calendarPageReducer = (state = {
    events: [],
    selectedTaskPlan: {},
    selectedRelease: {},
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
                selectedRelease: Object.assign({}, action.project, {
                    taskPlan: undefined,
                    releasePlan: undefined
                }),
                selectedTaskPlan: action.project.taskPlan,
                selectedReleasePlan: action.project.releasePlan
            })

        case AC.SHOW_USERS_TASKS:
            let storedDateMoment = undefined
            let storedEndDateTime = undefined
            if (action.tasks && action.tasks.length) {
                action.tasks = action.tasks.map((tp, idx) => {
                    if (storedDateMoment && U.momentInUTC(tp.planningDateString).isSame(storedDateMoment)) {
                        console.log("condition true for ", tp._id)
                        tp.start = storedEndDateTime
                        tp.end = moment(tp.start).clone().add(tp.planning.plannedHours, "hours").toDate()
                        storedEndDateTime = tp.end
                    } else {
                        console.log("condition false for ", tp._id)
                        storedDateMoment = U.momentInUTC(tp.planningDateString)
                        tp.start = moment(tp.planningDateString).clone().add(10, "hours").toDate()
                        tp.end = moment(tp.start).clone().add(tp.planning.plannedHours, "hours").toDate()
                        storedEndDateTime = tp.end
                    }
                    return tp
                })
            } else action.tasks = []
            console.log("action.tasks---", action.tasks)
            return Object.assign({}, state, {
                events: action.tasks
            })

        default:
            return state;
    }
}
export default calendarPageReducer;
