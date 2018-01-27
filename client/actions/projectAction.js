import {ADD_PROJECTS, ADD_PROJECT, UPDATE_PROJECT, DELETE_PROJECT} from "./actionConsts"


export const addProjects = (projects) => ({
    type: ADD_PROJECTS,
    projects: projects
})

export const addProject = (project) => ({
    type: ADD_PROJECT,
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
