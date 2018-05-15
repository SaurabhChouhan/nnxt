import * as AC from './actionConsts'

export const addReleaseProjects = (projects) => ({
    type: AC.ADD_RELEASE_PROJECTS,
    projects: projects
})

export const addReleasePlans = (releaseProjectTasks) => ({
    type: AC.ADD_RELEASE_PROJECT_TASKS,
    releaseProjectTasks: releaseProjectTasks
})
export const addReleaseTaskPlannings = (taskPlans) => ({
    type: AC.ADD_RELEASE_TASK_PLANNINGS,
    taskPlans: taskPlans
})

export const addReleaseTaskPlanningToState = (taskPlan) => ({
    type: AC.ADD_RELEASE_TASK_PLANNING_TO_STATE,
    taskPlan: taskPlan
})

export const updateReleaseTaskPlanningToState = (taskPlan) => ({
    type: AC.UPDATE_RELEASE_TASK_PLANNING_TO_STATE,
    taskPlan: taskPlan
})

export const releaseProjectSelected = (project) => ({
    type: AC.RELEASE_PROJECT_SELECTED,
    project: project
})

export const releaseTaskPlanSelected = (taskPlan) => ({
    type: AC.RELEASE_TASK_PLAN_SELECTED,
    taskPlan: taskPlan
})


export const deleteTaskPlanningFromState = (planID) => ({
    type: AC.DELETE_TASK_PLAN,
    planID: planID
})

export const addDeveloperFilteredData = (developerPlans) => ({
    type: AC.ADD_DEVELOPER_FILTERED,
    developerPlans: developerPlans
})

export const updateDeveloperFilteredData = (developerPlanned) => ({
    type: AC.UPDATE_DEVELOPER_FILTERED,
    developerPlanned: developerPlanned
})

export const getAllReleaseProjectsFromServer = (status) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/status/' + status, {
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
                    dispatch(addReleaseProjects(json.data))
                }
            })
    }
}


export const getAllTaskPlannedFromServer = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/task-plans/' + releasePlanID, {
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
                    dispatch(addReleaseTaskPlannings(json.data))
                }
            })
    }
}

export const getTaskReleaseFromServer = (release, status, empFlag) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + release._id + '/release-plans-with/status/' + status + '/empflag/' + empFlag, {
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
                    dispatch(addReleasePlans(json.data))
                }
            })
    }
}


export const addTaskPlanningOnServer = (taskPlanning) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/plan-task/', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskPlanning)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(addReleaseTaskPlanningToState(json.data))
                }
                return json
            })
    }
}


export const mergeTaskPlanningOnServer = (taskPlanning) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/merge-task-plan/', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskPlanning)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    console.log("merge json.data", json.data)
                    dispatch(updateReleaseTaskPlanningToState(json.data))
                    dispatch(updateDeveloperFilteredData(json.data))
                }
                return json
            })
    }
}


export const deleteTaskPlanningFromServer = (taskPlanningID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/plan-task/' + taskPlanningID, {
                method: 'delete',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(deleteTaskPlanningFromState(taskPlanningID))
                }
                return json
            })
    }
}

export const getDeveloperDetailsWithFilterOnServer = (employeeId, StartDate, EndDate) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/task-plans/employee/' + employeeId + '/fromDate/' + StartDate + '/toDate/' + EndDate, {
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
                    dispatch(addDeveloperFilteredData(json.data))
                }
                return json
            })
    }
}


export const shiftTasksToFutureOnServer = (shift) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/shift-future/', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(shift)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    console.log("json.data", json.data)
                    dispatch(getAllTaskPlannedFromServer(json.data.releasePlanID))
                }
                return json
            })
    }
}


export const shiftTasksToPastOnServer = (shift) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/shift-past/', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(shift)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(getAllTaskPlannedFromServer(json.data.releasePlanID))
                }
                return json
            })
    }
}

