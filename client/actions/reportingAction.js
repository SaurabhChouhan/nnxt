import * as AC from './actionConsts'

export const addUserReleases = (releases) => ({
    type: AC.ADD_USER_RELEASES,
    releases: releases
})

export const addReportingTasksSelectedDate = (tasks, date) => ({
    type: AC.ADD_REPORTING_TASKS_SELECTED_DATE,
    tasks: tasks,
    date: date
})

export const releaseSelectedForReporting = (release) => ({
    type: AC.RELEASE_SELECTED_FOR_REPORTING,
    release: release
})


export const setReportDate = (reportDate) => ({
    type: AC.SET_REPORT_DATE,
    reportDate: reportDate
})

export const reportTaskSelected = (details) => ({
    type: AC.REPORT_TASK_SELECTED,
    details: details
})

export const updateSelectedTaskPlan = (taskPlan) => ({
    type: AC.UPDATE_SELECTED_TASK_PLAN,
    taskPlan: taskPlan
})

export const updateSelectedReleasePlan = (releasePlan) => ({
    type: AC.UPDATE_SELECTED_RELEASE_PLAN,
    releasePlan: releasePlan
})

export const setStatus = (status) => ({
    type: AC.SET_STATUS,
    status: status
})


/**
 * Gets all releases date
 */
export const getUserReleasesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/user-releases', {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addUserReleases(json.data))
                }
            })
    }
}


/**
 * Gets tasks that user can see/report for selected date
 */
export const getReportingTasksForDate = (releaseID, date, taskStatus) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/task-plans/release/' + releaseID + '/date/' + date + '/task-status/' + taskStatus, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addReportingTasksSelectedDate(json.data, date))
                }
                return json

            })
    }
}

/**
 *
 */
export const getReleaseDetailsForReporting = (releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releaseID + '/details-for-reporting', {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success && json.data && json.data.length > 0) {
                    dispatch(releaseSelectedForReporting(json.data[0]))
                }
                return json
            })
    }
}


export const getTaskDetailsForReportFromServer = (taskID, releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/task-plans/' + taskID + '/release/' + releaseID, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(reportTaskSelected(json.data))
                }
                return json
            })
    }
}

export const reportTaskToServer = (task) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/task-plans/' + task._id, {
                method: 'put',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    if (json.data && json.data.taskPlan && json.data.taskPlan._id) {
                        // return dispatch(getTaskPlanDetailsFromServer(json.data.taskPlan._id))
                    }

                }
                return json
            })
    }
}



export const addCommentToServer = (comment) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/comment', {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.data && json.data.releasePlanID) {
                    return dispatch(getReleasePlanByIdFromServer(json.data.releasePlanID))
                }
                return json
            })
    }
}


export const getReleasePlanByIdFromServer = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releasePlanID + '/release-plan', {
                method: 'get',
            credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(updateSelectedReleasePlan(json.data))
                }
                return json
            })
    }
}





