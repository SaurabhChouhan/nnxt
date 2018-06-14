import * as AC from "./actionConsts"


export const addProjects = (projects) => ({
    type: AC.ADD_PROJECTS,
    projects: projects
})

export const addProject = (project) => ({
    type: AC.ADD_PROJECT,
    project: project
})

export const deleteProject = (projectID) => ({
    type: AC.DELETE_PROJECT,
    projectID: projectID
})

export const editProject = (project) => ({

    type: AC.EDIT_PROJECT,
    project: project
})

export const getAllProjectsFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/projects', {
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
                    dispatch(addProjects(json.data))
                }
            })
    }
}

export const addProjectOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/projects',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain',
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
                    dispatch(addProject(json.data))


                }
                return json
        })
    }
}


export const deleteProjectOnServer = (projectID) => {
    return function (dispatch, getState) {
        return fetch('/api/projects/' + projectID,
            {
                method: "delete",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'ap plication/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(deleteProject(projectID))
                    // clear user form after update is successful
                }
                return json
        })
    }
}


export const editProjectOnServer = (project) => {
    return function (dispatch, getState) {
        return fetch('/api/projects',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(editProject(json.data))
                }
                return json
        })
    }
}
