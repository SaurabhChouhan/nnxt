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

export const addEstimationTask = (task) => ({
    type: AC.ADD_ESTIMATION_TASK,
    task: task
})

export const addEstimationFeature = (feature) => ({
    type: AC.ADD_ESTIMATION_FEATURE,
    feature: feature
})

export const estimationTaskDelete = (taskID) => ({
    type: AC.ESTIMATION_TASK_DELETE,
    taskID: taskID
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
        return fetch('/api/estimations/request/' + estimationID, {
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

export const requestReviewOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/review-request/' + estimationID, {
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



export const addTaskToEstimationOnServer = (task) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addEstimationTask(json.data))
                }
                return json
            })
    }
}

export const addFeatureToEstimationOnServer = (feature) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feature)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addEstimationFeature(json.data))
                }
                return json
            })
    }
}

export const getEstimationFromServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID, {
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
                    dispatch(selectEstimation(json.data))
                }
                return json
            })
    }
}


