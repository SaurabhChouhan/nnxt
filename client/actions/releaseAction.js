import * as AC from './actionConsts'
import * as A from '../actions'

export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const addAvailableReleases = (releases) => ({
    type: AC.ADD_AVAILABLE_RELEASES,
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

export const updateTaskPlanning = (taskPlan) => ({
    type: AC.UPDATE_TASK_PLANNING,
    taskPlan: taskPlan
})

export const updateTaskPlans = (taskPlans) => ({
    type: AC.UPDATE_TASK_PLANS,
    taskPlans: taskPlans
})

export const releaseSelected = (release) => ({
    type: AC.RELEASE_SELECTED,
    release: release
})

export const releasePlanSelected = (releasePlan) => ({
    type: AC.RELEASE_PLAN_SELECTED,
    releasePlan: releasePlan
})


export const updateReleasePlan = (releasePlan) => ({
    type: AC.UPDATE_RELEASE_PLAN,
    releasePlan: releasePlan
})

export const removeTaskPlanning = (planID) => ({
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
export const addTaskPlannings = (taskPlannings) => ({
    type: AC.ADD_TASK_PLANNINGS,
    taskPlannings: taskPlannings
})
export const updateReleaseDates = (releaseDates) => ({
    type: AC.UPDATE_RELEASE_DATES,
    releaseDates: releaseDates
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
                return json
            })
    }
}


export const getAllAvailableReleasesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/releases/', {
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
                    dispatch(addAvailableReleases(json.data))
                }
                return json
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
                return json
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
                return json
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
                return json
            })
    }
}


export const getReleasePlanDetailsFromServer = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releasePlanID + '/release-plan', {
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
                    dispatch(releasePlanSelected(json.data))
                }
                return json
            })
    }
}


export const getUpdatedReleasePlanFromServer = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + releasePlanID + '/release-plan', {
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
                    dispatch(updateReleasePlan(json.data))
                }
                return json
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
                    dispatch(addReleaseTaskPlanningToState(json.data.taskPlan))
                    if (json.data && json.data.taskPlan.releasePlan && json.data.taskPlan.releasePlan._id) {
                        dispatch(getUpdatedReleasePlanFromServer(json.data.taskPlan.releasePlan._id))
                    }
                    if (json.data && json.data.taskPlans && json.data.taskPlans.length > 0) {
                        dispatch(updateTaskPlans(json.data && json.data.taskPlans))
                        dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlan._id))
                    }

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
                    dispatch(updateTaskPlanning(json.data.taskPlan))
                    dispatch(updateDeveloperFilteredData(json.data.taskPlan))
                }
                return json
            })
    }
}


export const deleteTaskPlanningFromServer = (taskPlanningID, releasePlanID) => {
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
                    if (json.data && json.data.taskPlan && json.data.taskPlan._id) {
                        dispatch(removeTaskPlanning(json.data.taskPlan._id))
                    }
                    if (json.data && json.data.taskPlan && json.data.taskPlan.releasePlan && json.data.taskPlan.releasePlan._id) {
                        dispatch(getUpdatedReleasePlanFromServer(json.data.taskPlan.releasePlan._id))
                    }
                    if (json.data && json.data.taskPlans && json.data.taskPlans.length > 0) {
                        dispatch(updateTaskPlans(json.data && json.data.taskPlans))
                        dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlan._id))
                    }
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
                    if (json.data && json.data.taskPlan)
                        dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlanID))
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
                    if (json.data && json.data.taskPlan)
                        dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlanID))
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
                    dispatch(setFromDate(from))
                    dispatch(setDevelopersSchedule(json.data))
                }
                return json
            })
    }
}


export const getReleaseDevelopersFromServer = (releasePlanID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/release-plan/' + releasePlanID + '/role/developers', {
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
                    dispatch(A.addDevelopersToState(json.data))
                }
                return json
            })
    }
}

export const getAllTaskPlansOfThisReleaseFromServer = (releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/task-plans/release/' + releaseID, {
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

                    dispatch(addTaskPlannings(json.data))
                }
                return json
            })
    }
}


export const updateReleaseDatesOnServer = (releaseDates) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(releaseDates)
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(updateReleaseDates(json.data))
                }
                return json
            })
    }
}
