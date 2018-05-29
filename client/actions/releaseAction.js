import * as AC from './actionConsts'

export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const addReleasePlans = (releasePlans) => ({
    type: AC.ADD_RELEASE_PLANS,
    releasePlans: releasePlans
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

export const releaseSelected = (release) => ({
    type: AC.RELEASE_SELECTED,
    release: release
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

export const setDevelopersSchedule = (schedules) => ({
    type: AC.SET_DEVELOPERS_SCHEDULE,
    schedules: schedules
})

export const expandDescription = (flag) => ({
    type: AC.EXPAND_DESCRIPTION,
    flag: flag
})

export const setEmployeeSettings = (empSetting) => ({
    type: AC.SET_EMPLOYEE_SETTINGS,
    empSetting: empSetting
})

export const setFromDate = (date) => ({
    type: AC.SET_FROM_DATE,
    date: date
})

export const getAllReleasesFromServer = (status) => {
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
                    dispatch(addReleases(json.data))
                }
            })
    }
}


export const getReleaseFromServer = (releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/release/' + releaseID, {
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
                    dispatch(releaseSelected(json.data))
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

export const getReleasePlansFromServer = (releaseID, status, empFlag) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releaseID + '/status/' + status + '/flag/' + empFlag + '/release-plans', {
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


export const getDeveloperSchedulesFromServer = (employeeID, from) => {
    return (dispatch, getState) => {
        return fetch('/api/employees/' + employeeID + '/from/' + from + '/employee-schedule', {
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
                    console.log("json.data", json.data)
                    dispatch(setFromDate(from))
                    dispatch(setDevelopersSchedule(json.data))
                }
                return json
            })
    }
}

