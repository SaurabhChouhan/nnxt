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

export const setTaskAndProjectDetails = (project) => ({
    type: AC.SET_TASK_AND_PROJECT_DETAILS,
    project: project
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
    console.log("getTaskAndProjectDetailsForCalendarFromServer bk4", taskPlanID)
    return function (dispatch, getState) {
        return fetch('/api/calendars/' + taskPlanID + '/task-plan',
            {
                method: "get",
                credentials: "include"
            }
        ).then(
            response => response.json()
        ).then(json => {
            if (json.success) {
                dispatch(setTaskAndProjectDetails(json.data))
            }
            return json
        })
    }
}
