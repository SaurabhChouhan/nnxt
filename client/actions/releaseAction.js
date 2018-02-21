import * as AC from './actionConsts'


export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})
export const addReleasePlans = (releasePlans) => ({
    type: AC.ADD_RELEASES_TASK,
    releasePlans: releasePlans
})
export const releaseProjectSelected = (project) => ({
    type: AC.ADD_RELEASE_PROJECT_SELECTED,
    project: project
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
export const getTaskReleaseFromServer = (release) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/' + release._id + '/release-plans', {
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