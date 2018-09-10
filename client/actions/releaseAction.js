import * as AC from './actionConsts'
import * as A from '../actions'

export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const addRelease = (release) => ({
    type: AC.ADD_RELEASE,
    release: release
})


export const addAvailableReleases = (releases) => ({
    type: AC.ADD_AVAILABLE_RELEASES,
    releases: releases
})

export const addReleasePlans = (releasePlans) => ({
    type: AC.ADD_RELEASE_PLANS,
    releasePlans: releasePlans
})

export const deleteReleasePlan = (releasePlanID) => ({
    type: AC.DELETE_RELEASE_PLAN,
    releasePlanID: releasePlanID
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

export const releaseTabSelected = (tab) => ({
    type: AC.RELEASE_TAB_SELECTED,
    tab: tab
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

export const expandDescriptionTaskList = (flag) => ({
    type: AC.EXPAND_DESCRIPTION_TASK_LIST,
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
export const updateReleaseDates = (release) => ({
    type: AC.UPDATE_RELEASE_DATES,
    release
})

export const selectIteration = (iteration) => ({
    type: AC.ITERATION_SELECTED,
    iteration
})
export const searchReleaseTaskPlans = (data) => ({
    type: AC.SEARCH_TASK_PLANS_IN_RELEASE,
    taskPlans: data
})

export const expandDescriptionTaskReportList = (flag) => ({
    type: AC.EXPAND_DESCRIPTION_TASK_REPORT_LIST,
    flag: flag
})

export const expandDescriptionReleasePlanList = (flag) => ({
    type: AC.EXPAND_DESCRIPTION_RELEASE_PLAN_LIST,
    flag: flag
})

export const changeReleasePlanFilters = (filters) => ({
    type: AC.CHANGE_RELEASEPLAN_FILTERS,
    filters
})

export const changeReleaseFilters = (filters) => ({
    type: AC.CHANGE_RELEASE_FILTERS,
    filters
})

export const getAllReleasesFromServer = (status, flag) => {
    return (dispatch, getState) => {
        let api = '';
        if (flag)
            api = '/api/releases/all/status/' + status
        else
            api = '/api/releases/mine/status/' + status

        return fetch(api, {
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

export const getAllReleasesToAddEstimationFromServer = (estimationID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/estimation/' + estimationID, {
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
        return fetch('/api/task-plans/release-plan/' + releasePlanID, {
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
                    dispatch(addDeveloperFilteredData([]))
                    dispatch(setDevelopersSchedule([]))
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
        return fetch('/api/release-plans/' + releasePlanID, {
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

export const deleteReleasePlanFromServer = (releasePlanID) => {
    return (dispatch) => {
        return fetch('/api/release-plans/' + releasePlanID, {
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
                    dispatch(deleteReleasePlan(releasePlanID))
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
        return fetch('/api/task-plans', {
                method: 'post',
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


export const moveTaskPlanOnServer = (taskPlanning) => {
    return (dispatch) => {
        return fetch('/api/task-plans/' + taskPlanning._id + '/move', {
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
                    dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlan._id))
                }
                return json
            })
    }
}


export const deleteTaskPlanningFromServer = (taskPlanningID) => {
    return (dispatch, getState) => {
        return fetch('/api/task-plans/' + taskPlanningID, {
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

export const reopenTaskPlanOnServer = (taskPlanningID) => {
    return (dispatch) => {
        return fetch('/api/task-plans/' + taskPlanningID + '/reopen', {
                method: 'put',
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
                    dispatch(getAllTaskPlannedFromServer(json.data.taskPlan.releasePlan._id))
                }
                return json
            })
    }
}

export const getEmployeePlanDetailsForRelease = (employeeId, startDate, endDate, releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/task-plans/employee/' + employeeId + '/fromDate/' + startDate + '/toDate/' + endDate + '/release/' + releaseID, {
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
        let state = getState()
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
                    dispatch(getAllTaskPlannedFromServer(state.release.selectedReleasePlan._id))
                    dispatch(addDeveloperFilteredData([]))
                    dispatch(setDevelopersSchedule([]))
                }
                return json
            })
    }
}


export const shiftTasksToPastOnServer = (shift) => {
    return (dispatch, getState) => {
        let state = getState()
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
                    dispatch(getAllTaskPlannedFromServer(state.release.selectedReleasePlan._id))
                    dispatch(addDeveloperFilteredData([]))
                    dispatch(setDevelopersSchedule([]))
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
        return fetch('/api/task-plans/release/' + releaseID, {
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


export const changeReleaseDateOfIteration = (iterationData) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/release-date', {
                method: 'put',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(iterationData)
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

export const releasePlanPlannedAddToReleaseOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/release-plans/add-planned-task ',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
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
                    dispatch(updateReleasePlan(json.data))
                }
                return json
            }
        )
    }
}

export const releasePlanUnplannedAddToReleaseOnServer = (formInput) => {
    return function (dispatch) {
        return fetch('/api/release-plans/add-unplanned-task ',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
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
                    dispatch(updateReleasePlan(json.data))
                }
                return json
            }
        )
    }
}

export const createReleaseOnServer = (formInput) => {
    return (dispatch) => {
        return fetch('/api/releases', {
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
                    dispatch(addRelease(json.data))
                }
                return json
            })
    }
}

export const updateReleaseOnServer = (formInput) => {
    return (dispatch) => {
        return fetch('/api/releases', {
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
                    dispatch(releaseSelected(json.data))
                }
                return json
            })
    }
}


export const getIterationDatesReleasePlansFromServer = (releasePlanId) => {
    return (dispatch) => {
        return fetch('/api/releases/release-plan/' + releasePlanId + '/iteration-data', {
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
                    if (json.data && json.data.release && json.data.release.iteration)
                        dispatch(selectIteration(json.data.release.iteration))
                }
                return json
            })
    }
}
export const getSearchTaskPlanResultFromServer = (formInput) => {
    console.log("get the release result from server getSearchTaskPlanResultFromServer ", formInput)
    return (dispatch) => {
        return fetch('/api/task-plans/search', {
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
                    dispatch(addReleaseTaskPlannings(json.data))
                }
                return json
            })
    }
}

export const searchReleasePlansOnServer = (formInput) => {
    return (dispatch) => {
        return fetch('/api/release-plans/search', {
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
                    dispatch(addReleasePlans(json.data))
                    dispatch(changeReleasePlanFilters(formInput))
                }
                return json
            })
    }
}

export const searchReleaseFromServer = (formInput) => {
    console.log("get the release result from server getSearchReleasesFromServerByFlags ", formInput)
    return (dispatch) => {
        return fetch('/api/releases/search', {
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
                    dispatch(addReleases(json.data))
                    dispatch(changeReleaseFilters(formInput))
                }
                return json
            })
    }
}