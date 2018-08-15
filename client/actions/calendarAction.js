import * as AC from '../actions/actionConsts'

export const changeNavigationView = (view, date) => ({
    type: AC.CHANGE_CALENDAR_NAVIGATION,
    view: view,
    date: date
})

export const showUsersTask = (tasks) => ({
    type: AC.SHOW_USERS_TASKS,
    tasks: tasks
})

export const setCalendarTaskDetails = (detail) => ({
    type: AC.SET_CALENDAR_TASK_DETAILS,
    detail: detail
})

export const getAllTaskPlansFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/calendars/tasks',
            {
                method: "get",
                credentials: "include"
            }
        ).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(showUsersTask(json.data))
            }
        })
    }
}


export const getTaskAndProjectDetailsForCalendarFromServer = (taskPlanID) => {
    return function (dispatch, getState) {
        return fetch('/api/calendars/task-details/task-plan/' + taskPlanID,
            {
                method: "get",
                credentials: "include"
            }
        ).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(setCalendarTaskDetails(json.data))
            }
            return json
        })
    }
}
