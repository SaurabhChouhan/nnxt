import * as AC from './actionConsts'


export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const addReleasePlans = (releasePlans) => ({
    type: AC.ADD_RELEASES_TASK,
    releasePlans: releasePlans
})
export const addReleaseTaskPlanning = (task) => ({
    type: AC.ADD_RELEASES_TASK_PLANNING,
    task: task
})

export const releaseProjectSelected = (project) => ({
    type: AC.ADD_RELEASE_PROJECT_SELECTED,
    project: project
})

export const releaseTaskSelected = (task) => ({
    type: AC.RELEASE_TASK_SELECTED,
    task: task
})

export const addTaskPlanningToState = (taskPlan) => ({
    type: AC.ADD_TASK_PLANNING_TO_STATE,
    taskPlan: taskPlan
})

export const getAllReleaseFromServer = (status) => {
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
                    console.log("getTaskReleaseFromServer ", json.data)
                    dispatch(addReleasePlans(json.data))
                }
            })
    }
}

export const addTaskPlanningOnServer = (task) => {
    console.log("task inside release planning for task planning",task)
    console.log("task inside release planning for task planning",task.task._id)
    return (dispatch, getState) => {
        return fetch('/api/plan-task/' + task.task._id, {
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
                    dispatch(addReleaseTaskPlanning(json.data))
                }
                return json
            })
    }
}


/*export const getTaskDetailReleaseFromServer = (releasePlan,task) => {
    return (dispatch, getState) => {
        console.log("inside plan task action",releasePlan,task)
        return fetch('/api/releases/release-plans/'+ releasePlan._id + '/release-plans-with/task/' + task._id +  {
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
                    console.log("getTaskDetailReleaseFromServer ", json.data)
                    dispatch(addTaskDetailPlans(json.data))
                }
            })
    }
}*/
