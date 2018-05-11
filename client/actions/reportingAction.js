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

export const taskSelected = (task) => ({
    type: AC.TASK_SELECTED,
    task: task
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
