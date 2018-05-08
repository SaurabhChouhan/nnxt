import * as AC from './actionConsts'

export const addReportingProjects = (projects) => ({
    type: AC.ADD_REPORTING_PROJECTS,
    projects: projects
})
export const getAllReportingProjectsAndTaskPlansFromServer = (projectStatus, planDate, taskStatus) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/report/project-status/' + projectStatus + '/date/' + planDate + '/task-status/' + taskStatus , {
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