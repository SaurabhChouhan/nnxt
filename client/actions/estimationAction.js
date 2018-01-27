import * as AC from './actionConsts'


export const addEstimations = (estimations) => ({
    type: AC.ADD_ESTIMATIONS,
    estimations: estimations
})

export const addEstimation = (estimation) => ({
    type: AC.ADD_ESTIMATION,
    estimation: estimation
})

export const editEstimation = (estimation) => ({
    type: AC.EDIT_ESTIMATION,
    estimation: estimation
})


export const selectEstimation = (estimation) => ({
    type: AC.SELECT_ESTIMATION,
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

export const initiateEstimationOnServer = (formInput) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/initiate', {
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
                    dispatch(addEstimation(json.data))
                }

                return json
            })
    }
}

export const requestEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/request/'+estimationID, {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(editEstimation(json.data))
                }
                return json
            })
    }
}

