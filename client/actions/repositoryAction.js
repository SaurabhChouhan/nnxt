import * as AC from './actionConsts'
import * as A from "./index";
import * as COC from "../components/componentConsts";
import {NotificationManager} from "react-notifications";


export const selectRepository = (repository) => ({
    type: AC.SELECT_REPOSITORY,
    repository: repository
})

export const selectTaskFromRepository = (task) => ({
    type: AC.SELECT_TASK_FROM_REPOSITORY,
    task: task
})

export const getRepositoryFromServer = (technologies,type) => {
    return (dispatch, getState) => {
        return fetch('/api/repositories/search',{
                method: 'post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({"technologies":technologies,"type":type})
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

