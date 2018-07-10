import * as AC from './actionConsts'

export const addWarnings = (warnings) => ({
    type: AC.ADD_WARNINGS,
    warnings: warnings
})

export const getAllWarningsOfThisReleaseFromServer = (releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/warning/release/'+releaseID, {
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
                    dispatch(addWarnings(json.data))
                }
                return json
            })
    }
}
export const getWarningsFromServer = (warningType, status, empFlag) => {
    console.log("----------warningID, status, empFlag-----------",warningType, status, empFlag)
    return (dispatch, getState) => {
        return fetch('/api/warning/' + warningType + '/status/' + status + '/flag/' + empFlag + '/release-plans', {
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
                    dispatch(addWarnings(json.data))
                }
                return json
            })
    }
}
