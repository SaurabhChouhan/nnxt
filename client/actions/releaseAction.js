import * as AC from './actionConsts'


export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const addReleasePlans = (releasePlans) => ({
    type: AC.ADD_RELEASES_TASK,
    releasePlans: releasePlans
})
export const addTaskDetailPlans = (task) => ({
    type: AC.ADD_RELEASES_TASK_DETAIL,
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
export const getTaskDetailReleaseFromServer = (releasePlan,task) => {
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
}