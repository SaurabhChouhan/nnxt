import * as AC from './actionConsts'


export const selectRepository = (repository) => ({
    type: AC.SELECT_REPOSITORY,
    repository: repository
})

export const selectTaskFromRepository = (task) => ({
    type: AC.SELECT_TASK_FROM_REPOSITORY,
    task: task
})

export const selectFeatureFromRepository = (feature) => ({
    type: AC.SELECT_FEATURE_FROM_REPOSITORY,
    feature: feature
})

export const getRepositoryFromServer = (technologies, type, searchText) => {
    return (dispatch, getState) => {
        return fetch('/api/repositories/search', {
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"technologies": technologies, "type": type, "searchText": searchText})
            }
        ).then(
            response => response.json()
        ).then(
            json => {
                if (json.success) {
                    dispatch(selectRepository(json.data))
                }
                return json
            })
    }
}

