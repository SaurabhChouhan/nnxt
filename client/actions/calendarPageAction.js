export const showSelectedTaskDetail = (event) => ({
    type: 'SHOW_SELECTED_TASK_DETAIL',
    event: event
})
export const changeNavigationView = (view, date) => ({
    type: 'CHANGE_CALENDAR_NAVIGATION',
    view: view,
    date: date
})

export const showCalendarView = () => ({
    type: 'SHOW_CALENDAR_VIEW'
})
export const showUsersTask = (tasks) => ({
    type: 'SHOW_USERS_TASKS',
    tasks: tasks
})

export const getAllTaskPlansFromServer = () => {
    return function (dispatch, getState) {
        return fetch('/api/calenders/tasks',
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

/*
export const getSelectedTaskDetailFromServer = (taskID) => {
    return function (dispatch, getState) {
        return fetch('/api/calenders/tasks',
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
}*/
