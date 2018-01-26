import {ADD_ESTIMATIONS, ADD_ESTIMATION, DELETE_ESTIMATION, UPDATE_ESTIMATION} from "./actionConsts"


export const addEstimations = (estimations) => ({
    type: ADD_ESTIMATIONS,
    estimations: estimations
})

export const addEstimation = (estimation) => ({
    type: ADD_ESTIMATION,
    estimation: estimation
})

export const getAllEstimationsFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/estimations', {
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
                    dispatch(addEstimations(json.data))
                }
            })
    }
}

