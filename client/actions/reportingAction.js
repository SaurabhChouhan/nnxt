import * as AC from './actionConsts'

export const addReportingProjects = (projects) => ({
    type: AC.ADD_REPORTING_PROJECTS,
    projects: projects
})


export const addReportingTaskPlannings = (project) => ({
    type: AC.ADD_SELECTED_PROJECT_AND_REPORTING_TASK_PLANNINGS,
    project: project
})


export const noProjectSelected = (project) => ({
    type: AC.NO_PROJECT_SELECTED,
    project: project
})

export const setReportDate = (reportDate) => ({
    type: AC.SET_REPORT_DATE,
    reportDate: reportDate
})

export const taskProjectSelected = (project) => ({
    type: AC.TASK_PROJECT_SELECTED,
    project: project
})

export const getAllReportingProjectsFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/releases/report', {
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
                    dispatch(addReportingProjects(json.data))
                }
            })
    }
}


export const getProjectDeatilAndTaskPlanningsFromServer = (releaseID, planDate, taskStatus) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/report/task-plans/release/' + releaseID + '/date/' + planDate + '/task-status/' + taskStatus, {
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
                    dispatch(addReportingTaskPlannings(json.data))
                }
                return json

            })
    }
}

export const getTaskAndProjectDetailsFromServer = (taskID, releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/report/taskID/' + taskID + '/releaseID/' + releaseID + 'detail', {
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
                    dispatch(taskProjectSelected(json.data))
                }
                return json

            })
    }
}