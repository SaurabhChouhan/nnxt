import * as AC from './actionConsts'
import * as A from "./index";
import * as COC from "../components/componentConsts";
import {NotificationManager} from "react-notifications";


export const selectRepository = (repository) => ({
    type: AC.SELECT_REPOSITORY,
    repository: repository
})

export const getRepositoryFromServer = (technologies) => {
    return (dispatch, getState) => {
        return fetch('/api/repositories/search?technologies=' + technologies, {
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
                    dispatch(selectRepository(json.data))
                }
                return json
            })
    }
}

