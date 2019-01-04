import * as AC from "./actionConsts"

export const addClientReleases = (client, releases) => ({
    type: AC.ADD_RELEASES_OF_CLIENT,
    client,
    releases
})


export const getReleasesOfClientFromServer = (clientID) => {
    return (dispatch, getState) => {
        return fetch('/api/releases/client/' + clientID, {
            method: 'get',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(
            response => response.json()
        )
    }
}