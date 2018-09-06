import * as AC from './actionConsts'

export const addUserReleases = (releases) => ({
    type: AC.ADD_USER_RELEASES,
    releases: releases
})

export const addReleasesAndTasksOfSelectedDate = (reportReleases, activeReleases, date) => ({
    type: AC.ADD_RELEASES_AND_TASKS_OF_SELECTED_DATE,
    reportReleases,
    activeReleases,
    date: date
})

export const setReportDate = (reportDate) => ({
    type: AC.SET_REPORT_DATE,
    reportDate: reportDate
})

export const setReportedStatus = (status) => ({
    type: AC.SET_STATUS,
    status: status
})

export const setReleaseID = (releaseID) => ({
    type: AC.SET_RELEASE_ID,
    releaseID: releaseID
})

export const setIterationType = (iterationType) => ({
    type: AC.SET_ITERATION_TYPE,
    iterationType: iterationType
})

export const releaseSelectedForReporting = (release) => ({
    type: AC.RELEASE_SELECTED_FOR_REPORTING,
    release: release
})

export const setReportTaskPlanDetail = (detail) => ({
    type: AC.REPORT_TASK_SELECTED,
    detail: detail
})

export const updateSelectedTaskPlan = (taskPlan) => ({
    type: AC.UPDATE_SELECTED_TASK_PLAN,
    taskPlan: taskPlan
})

export const updateSelectedReleasePlan = (releasePlan) => ({
    type: AC.UPDATE_SELECTED_RELEASE_PLAN,
    releasePlan: releasePlan
})


export const setReportsOfRelease = (reports) => ({
    type: AC.SET_REPORTS_OF_RELEASE,
    reports: reports
})

export const taskReported = (task) => ({
    type: AC.TASK_REPORTED,
    task: task
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
                return json.data
            })
    }
}


/**
 * Gets tasks that user can see/report for selected date
 */
export const getReportingTasksForDate = (releaseID, date, iterationType, taskStatus) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/task-plans/release/' + releaseID + '/date/' + date + '/iteration-type/' + iterationType + '/task-status/' + taskStatus, {
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
                    dispatch(addReleasesAndTasksOfSelectedDate(json.data.reportReleases, json.data.activeReleases, date))
                }
                return json
            })
    }
}


export const getDataForReportTaskDetailPageFromServer = (taskPlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/report-task-detail-page/task-plan/' + taskPlanID, {
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
                    dispatch(setReportTaskPlanDetail(json.data))
                }
                return json
            })
    }
}

export const getTaskReportsReleasePlanPage = (releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/reporting/release-plan-page/release/' + releaseID, {
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
                    console.log("json-data", json.data)
                    dispatch(setReportsOfRelease(json.data))
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
export const getReleaseTaskReportsResultFromServer = (formInput) => {
    console.log("get the release result from server getReleaseTaskReportsResultFromServer ", formInput)

    // Add reported true flag in order to get only those task plans that are reported

    formInput.reported = true

    return (dispatch) => {
        return fetch('/api/task-plans/search', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(setReportsOfRelease(json.data))
                }
                return json
            })
    }
}




