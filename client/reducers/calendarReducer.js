import moment from 'moment'
import * as AC from '../actions/actionConsts'
import * as SC from '../../server/serverconstants'
import _ from 'lodash'

const calendarPageReducer = (state = {
    events: [],
    selectedTaskPlan: {},
    selectedRelease: {},
    selectedReleasePlan: {},
    defaultView: "week",
    defaultDate: undefined,
    selectedView: "week",
    selectedDate: undefined

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
            /**
             * We would have to modify start/end date of tasks in such a manner that tasks of same date are shown
             * one after another. Since time is not added while adding plan we will consider that work would be started
             * on 10 and there would be no gap between work. This is just to show tasks one after another, developer
             * would be free to start/end tasks at any time of his choice through out the day
             */

            let tasks = []
            if (action.tasks && action.tasks.length) {
                // Iterate on tasks to group them by same date/same employee

                let groupedTasks = _.groupBy(action.tasks, (t) => {
                    return t.planningDateString + "_" + t.employee._id.toString()
                })

                _.forEach(groupedTasks, (tasksSameDaySameEmployee,key)=>{
                    let startMoment = moment(tasksSameDaySameEmployee[0].planningDateString, SC.DATE_FORMAT)
                    // We would start with 10 am
                    startMoment.add(10, 'hours')
                    tasksSameDaySameEmployee.forEach(ts=>{
                        let endMoment = startMoment.clone().add(ts.planning.plannedHours, "hours")
                        ts.start = startMoment.toDate()
                        ts.end = endMoment.toDate()
                        ts.title = ts.task.name
                        tasks.push(ts)
                        startMoment = endMoment.clone()
                    })
                })

                console.log("Tasks calendar ", tasks)


            }
            return Object.assign({}, state, {
                events: tasks,
                selectedDate:moment().startOf('day').toDate()
            })
        default:
            return state;
    }
}
export default calendarPageReducer;
