import * as AC from './actionConsts'

export const addWarnings = (warnings) => ({
    type: AC.ADD_WARNINGS,
    warnings: warnings
})

export const getAllWarningsOfThisReleaseFromServer = (warningType, releaseID) => {
    return (dispatch, getState) => {
        return fetch('/api/warning/release/' + releaseID + '/warningName/' + warningType, {
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