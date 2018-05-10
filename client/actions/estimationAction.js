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

export const taskEditRequest = (task) => ({
    type: AC.REQUEST_FOR_TASK_EDIT_PERMISSION,
    task: task
})

export const deleteEstimationTask = (task) => ({
    type: AC.DELETE_ESTIMATION_TASK,
    task: task
})

export const selectEstimation = (estimation) => ({
    type: AC.SELECT_ESTIMATION,
    estimation: estimation
})

export const updateSelectedEstimation = (estimation) => ({
    type: AC.UPDATE_SELECTED_ESTIMATION,
    estimation: estimation
})

export const addEstimationTask = (task) => ({
    type: AC.ADD_ESTIMATION_TASK,
    task: task
})

export const updateEstimationTask = (task) => ({
    type: AC.UPDATE_ESTIMATION_TASK,
    task: task
})

export const addEstimationFeature = (feature) => ({
    type: AC.ADD_ESTIMATION_FEATURE,
    feature: feature
})

export const updateEstimationFeature = (feature) => ({
    type: AC.UPDATE_ESTIMATION_FEATURE,
    feature: feature
})

export const estimationTaskDelete = (taskID) => ({
    type: AC.ESTIMATION_TASK_DELETE,
    taskID: taskID
})

export const moveTaskInFeature = (task) => ({
    type: AC.MOVE_TASK_IN_FEATURE,
    task: task
})

export const moveTaskOutOfFeature = (task, featureID) => ({
    type: AC.MOVE_TASK_OUTOF_FEATURE,
    task: task,
    featureID: featureID
})

export const deleteEstimationFeature = (feature) => ({
    type: AC.DELETE_ESTIMATION_FEATURE,
    feature: feature
})

export const expandFeature = (featureID) => ({
    type: AC.EXPAND_FEATURE,
    featureID: featureID
})

export const expandTask = (taskID) => ({
    type: AC.EXPAND_TASK,
    taskID: taskID
})

export const expandTaskAndFeature = (featureID, taskID) => ({
    type: AC.EXPAND_TASK_AND_FEATURE,
    taskID: taskID,
    featureID: featureID
})

export const addFilteredEstimation = (filter) => ({
    type: AC.ADD_FILTERED_ESTIMATIONS,
    filter: filter
})

export const clearFilterFromEstimation = () => ({
    type: AC.CLEAR_FILTER_FROM_ESTIMATION
})

export const deleteEstimation = (estimationID) => ({
    type: AC.DELETE_ESTIMATION,
    estimationID: estimationID
})


export const getAllEstimationsFromServer = (projectID, status) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/project/' + projectID + '/status/' + status, {
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


export const initiateEstimationOnServer = (estimation) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/initiate', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(estimation)
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


export const updateEstimationOnServer = (estimation) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/update', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(estimation)
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


export const deleteEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/delete", {
                method: 'delete',
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
                    dispatch(deleteEstimation(estimationID))
                }
                return json
            })
    }
}


export const requestEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/request", {
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
        return fetch('/api/estimations/' + estimationID + "/review-request", {
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
                    dispatch(getEstimationFromServer(estimationID))

                }
                return json
            })
    }
}


export const checkHasErrorInEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/hasError", {
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


export const requestChangeOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/change-request", {
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
                    //dispatch(editEstimation(json.data))
                    // During change request,  flags of tasks/feature may also change so select this estimation again to get latest data
                    dispatch(getEstimationFromServer(estimationID))

                }
                return json
            })
    }
}


export const requestForTaskEditPermissionOnServer = (taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + taskID + '/request-edit', {
                method: 'put',
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
                    // As json.data would contain complete updated task just fire update redux action
                    dispatch(updateEstimationTask(json.data))
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))
                    }
                }
                return json
            })
    }
}


export const requestForFeatureEditPermissionOnServer = (featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/' + featureID + '/request-edit', {
                method: 'put',
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
                    // As json.data would contain complete updated feature just fire update redux action
                    dispatch(updateEstimationFeature(json.data))
                }
                return json
            })
    }
}


export const deleteEstimationTaskOnServer = (estimationID, taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + '/tasks/' + taskID, {
                method: 'delete',
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
                    dispatch(deleteEstimationTask(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))
                    }
                }
                return json
            })
    }
}


export const requestForTaskDeletePermissionOnServer = (taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + taskID + '/request-removal', {
                method: 'put',
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
                    dispatch(updateEstimationTask(json.data))
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(canNotApproveFeatureOnServer(json.data.feature._id, false))
                    }
                    if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, false))
                    }
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
                    if (json.data && json.data.isEstimationCanApprove && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, false))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }

                    if (json.data && json.data.isFeatureCanApprove && json.data.feature && json.data.feature._id) {
                        dispatch(canNotApproveFeatureOnServer(json.data.feature._id, false))
                    } else if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))
                    }
                }
                return json
            })
    }
}


export const addTaskFromRepositoryToEstimationOnServer = (estimationID, taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/estimation/' + estimationID + '/repository-task/' + taskID, {
                method: 'post',
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
                    dispatch(addEstimationTask(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id && json.data.isEstimationCanApprove) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const copyTaskFromRepositoryToEstimationOnServer = (estimationID, taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/estimation/' + estimationID + '/repository-task-copy/' + taskID, {
                method: 'post',
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
                    dispatch(addEstimationTask(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id && json.data.isEstimationCanApprove) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const addFeatureFromRepositoryToEstimationOnServer = (estimationID, featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/estimation/' + estimationID + '/repository-feature/' + featureID, {
                method: 'post',
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
                    dispatch(addEstimationFeature(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id && json.data.isEstimationCanApprove) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const copyFeatureFromRepositoryToEstimationOnServer = (estimationID, featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/estimation/' + estimationID + '/repository-feature-copy/' + featureID, {
                method: 'post',
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
                    dispatch(addEstimationFeature(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id && json.data.isEstimationCanApprove) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const updateTaskToEstimationOnServer = (task) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks', {
                method: 'put',
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
                    dispatch(updateEstimationTask(json.data))
                    if (json.data && json.data.isEstimationCanApprove && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, false))
                    } else if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                    if (json.data && json.data.isFeatureCanApprove && json.data.feature && json.data.feature._id) {
                        dispatch(canNotApproveFeatureOnServer(json.data.feature._id, false))
                    } else if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))

                    }
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
                    if (json.data && json.data.isEstimationCanApprove && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, false))
                    }
                }
                return json
            })
    }
}


export const updateFeatureToEstimationOnServer = (feature) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                    if (json.data && json.data.isEstimationCanApprove && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, false))
                    }
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


export const getOnlyEstimationFromServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + '/only', {
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
                    dispatch(updateSelectedEstimation(json.data))
                }
                return json
            })
    }
}


export const getFeatureFromServer = (featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/feature/' + featureID, {
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
                    dispatch(updateEstimationFeature(json.data))
                }
                return json
            })
    }
}


export const moveTaskIntoFeatureOnServer = (taskID, featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + taskID + '/features/' + featureID, {
                method: 'put',
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
                    dispatch(moveTaskInFeature(json.data))
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))
                    }
                }
                return json
            })
    }
}


export const moveTaskOutOfFeatureOnServer = (task) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + task._id + '/move-out-of-feature', {
                method: 'put',
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
                    if (task && task.feature && task.feature._id) {
                        dispatch(getFeatureFromServer(task.feature._id))
                        dispatch(moveTaskOutOfFeature(json.data, task.feature._id))
                    }
                }
                return json
            })
    }
}


export const grantEditPermissionOfTaskOnServer = (taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + taskID + '/grant-edit', {
                method: 'put',
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
                    dispatch(updateEstimationTask(json.data))
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(canNotApproveFeatureOnServer(json.data.feature._id, true))
                    }
                    if (json.data && json.data.estimation && json.data.isEstimationCanApprove && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, true))
                    }
                }
                return json
            })
    }
}


export const grantEditPermissionOfFeatureOnServer = (featureId) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/' + featureId + '/grant-edit', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                    if (json.data && json.data.isEstimationCanApprove && json.data.estimation && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, true))
                    }
                }

                return json
            })
    }
}


export const deleteFeatureByEstimatorOnServer = (estimationID, featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + '/feature/' + featureID, {
                method: 'delete',
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
                    dispatch(deleteEstimationFeature(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(getOnlyEstimationFromServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const addProjectAwardOnServer = (formInput) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/project-awarded', {
                method: 'put',
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
                    dispatch(updateSelectedEstimation(json.data))
                }

                return json
            })
    }
}


export const requestForFeatureDeletePermissionOnServer = (featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/' + featureID + '/request-removal', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))

                }
                return json
            })
    }
}


export const approveTaskByNegotiatorOnServer = (taskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/tasks/' + taskID + '/approve', {
                method: 'put',
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
                    if (json.data && json.data.feature && json.data.feature._id) {
                        dispatch(canApproveFeatureOnServer(json.data.feature._id)).then(json => {
                            if (json.success) {
                            }
                            else {
                                dispatch(getFeatureFromServer(json.data.feature._id))
                            }
                            return json
                        })
                    }
                    if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(canApproveEstimationOnServer(json.data.estimation._id)).then(json => {
                            if (json.success) {
                            }
                            else {
                                dispatch(getOnlyEstimationFromServer(json.data._id))
                            }
                            return json
                        })
                    }
                    dispatch(updateEstimationTask(json.data))
                }
                return json
            })
    }
}


export const approveFeatureByNegotiatorOnServer = (featureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/features/' + featureID + '/approve', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                    if (json.data && json.data.estimation && json.data.estimation._id) {
                        dispatch(canApproveEstimationOnServer(json.data.estimation._id))
                    }
                }
                return json
            })
    }
}


export const approveEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/approve", {
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
                    //dispatch(editEstimation(json.data))
                    // During Approve,  flags of tasks/feature may also change so select this estimation again to get latest data
                    dispatch(getOnlyEstimationFromServer(estimationID))

                }
                return json
            })
    }
}


export const canApproveFeatureOnServer = (FeatureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/feature/' + FeatureID + '/can-approve', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                }
                return json
            })
    }
}


export const canApproveEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/can-approve", {
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
                    // During Approve,  flags of tasks/feature may also change so select this estimation again to get latest data
                    //dispatch(getOnlyEstimationFromServer(estimationID))

                }
                return json
            })
    }
}


export const canNotApproveFeatureOnServer = (FeatureID, grant) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/feature/' + FeatureID + '/can-not-approve/' + grant + '/is-granted', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                }
                return json
            })
    }
}


export const canNotApproveEstimationOnServer = (estimationID, grant) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + '/can-not-approve/' + grant + '/is-granted', {
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


export const reOpenFeatureOnServer = (FeatureID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/feature/' + FeatureID + '/reOpen', {
                method: 'put',
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
                    dispatch(updateEstimationFeature(json.data))
                    if (json.data && json.data.estimation && json.data.isEstimationCanApprove && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, true))
                    }
                }
                return json
            })
    }
}


export const reOpenTaskOnServer = (TaskID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/task/' + TaskID + '/reOpen', {
                method: 'put',
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
                    dispatch(updateEstimationTask(json.data))
                    if (json.data && json.data.feature && json.data.isFeatureApproved && json.data.feature._id) {
                        dispatch(getFeatureFromServer(json.data.feature._id))

                    } else if (json.data && json.data.feature && json.data.isFeatureCanApprove && json.data.feature._id) {
                        dispatch(canNotApproveFeatureOnServer(json.data.feature._id, true))

                    }
                    if (json.data && json.data.estimation && json.data.isEstimationCanApprove && json.data.estimation._id) {
                        dispatch(canNotApproveEstimationOnServer(json.data.estimation._id, true))
                    }

                }
                return json
            })
    }
}

export const reopenEstimationOnServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/estimations/' + estimationID + "/reopen", {
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



