import * as AC from './actionConsts'

export const addUserReleases = (releases) => ({
    type: AC.ADD_USER_RELEASES,
    releases: releases
})


export const addReportingTaskPlannings = (project) => ({
    type: AC.ADD_SELECTED_PROJECT_AND_REPORTING_TASK_PLANNINGS,
    project: project
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

export const taskProjectSelected = (project) => ({
    type: AC.TASK_PROJECT_SELECTED,
    project: project
})

export const updateSelectedTask = (taskPlan) => ({
    type: AC.UPDATE_SELECTED_TASK,
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
export const setProjectId = (releaseId) => ({
    type: AC.SET_PROJECT_ID,
    releaseId: releaseId
})

export const getUserReleasesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/reportings/user-releases', {
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
        return fetch('/api/reportings/task-plans/release/' + releaseID + '/date/' + date + '/task-status/' + taskStatus, {
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


export const getTaskAndProjectDetailsFromServer = (taskID, releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/reportings/' + taskID + '/release/' + releaseID + '/report-detail', {
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
                    dispatch(taskProjectSelected(json.data))
                }
                return json
            })
    }
}


export const addCommentToServer = (comment) => {
    return (dispatch, getState) => {
        return fetch('/api/reportings/comment', {
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
                if (json.success) {
                    return dispatch(getReleasePlansByID(json.data.releasePlanID))
                }
                return json
            })
    }
}


export const getReleasePlansByID = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releasePlanID + '/releasePlan', {
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
                    dispatch(updateSelectedReleasePlan(json.data))
                }
                return json
            })
    }
}


/*


export const addReportingTaskComment = (taskComment) => ({
    type: AC.ADD_TASK_COMMENT,
    taskComment: taskComment
})



export const addReportingTaskCommentOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/reportings/report/task-plans/comment',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addReportingTaskComment(json.data))
                }

                return json
            }
        )
    }
}
*/