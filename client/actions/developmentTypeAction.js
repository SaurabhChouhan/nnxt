import * as AC from "./actionConsts";

export const addDevelopmentTypes = (developmentTypes) => ({
    type: AC.ADD_DEVELOPMENT_TYPES,
    developmentTypes: developmentTypes
})

export const addDevelopmentType = (developmentType) => ({
    type: AC.ADD_DEVELOPMENT_TYPE,
    developmentType: developmentType
})

export const deleteDevelopmentType = (developmentTypeID) => ({
    type: AC.DELETE_DEVELOPMENT_TYPE,
    developmentTypeID: developmentTypeID
})

export const getAllDevelopmentTypesFromServer = () => {
    return (dispatch) => {
        return fetch('/api/developmentTypes', {
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
                    dispatch(addDevelopmentTypes(json.data))
                }
            })
    }
}