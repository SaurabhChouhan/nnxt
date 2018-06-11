import * as AC from "./actionConsts";

export const addTechnologies = (technologies) => ({
    type: AC.ADD_TECHNOLOGIES,
    technologies: technologies
})

export const addTechnology = (technology) => ({
    type: AC.ADD_TECHNOLOGY,
    technology: technology
})

export const deleteTechnology = (TechnologyID) => ({
    type: AC.DELETE_TECHNOLOGY,
    TechnologyID: TechnologyID
})

export const getAllTechnologiesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/technologies', {
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
                    dispatch(addTechnologies(json.data))
                }
            })
    }
}


export const addTechnologyOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/technologies',
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
                    dispatch(addTechnology(json.data))


                }
                return json
            }
        )
    }
}


export const deleteTechnologyOnServer = (TechnologyID) => {
    return function (dispatch, getState) {
        return fetch('/api/technologies/' + TechnologyID,
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
                    dispatch(deleteTechnology(TechnologyID))
                    // clear user form after update is successful
                }
                return json
            }
        )
    }
}