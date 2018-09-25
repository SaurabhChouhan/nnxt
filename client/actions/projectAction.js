import * as AC from "./actionConsts"


export const addProjects = (projects) => ({
    type: AC.ADD_PROJECTS,
    projects: projects
})

export const addFilteredProjects = (projects) => ({
    type: AC.ADD_FILTERED_PROJECTS,
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

export const updateProject = (project) => ({

    type: AC.UPDATE_PROJECT,
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

export const searchProjectsFromServer = (searchInput) => {
    return (dispatch) => {
        return fetch('/api/projects/search', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchInput)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addFilteredProjects(json.data))
                }

                return json
            })
    }
}


export const getAllProjectsUserReleasesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/projects/user-releases', {
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

export const getAllProjectsUserEstimationsFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/projects/user-estimations', {
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


export const toggleIsActive = (projectID) => {
    console.log("projectID", projectID)
    return function (dispatch, getState) {
        return fetch('/api/projects/' + projectID,
            {
                method: "put",
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
                dispatch(updateProject(json.data))
                // clear user form after update is successful
            }
            return json
        })
    }
}