import * as A from '../actions'
import * as AC from "./actionConsts";

export const getReleaseForDashboard = (releaseID) => {
    return function (dispatch) {
        return fetch('/api/releases/release/' + releaseID,
            {
                method: "get",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(calculateReleaseStats(json.data))
                }
                return json
            }
        )
    }
}


export const calculateReleaseStats = (release) => ({
    type: AC.CALCULATE_RELEASE_STATS,
    release: release
})