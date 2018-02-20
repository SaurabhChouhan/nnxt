import * as AC from './actionConsts'


export const addReleases = (releases) => ({
    type: AC.ADD_RELEASES,
    releases: releases
})

export const getAllReleaseFromServer = (status) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/status/'+status, {
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
