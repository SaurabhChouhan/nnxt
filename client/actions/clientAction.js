import {NotificationManager} from 'react-notifications'
import * as AC from "./actionConsts"
import {ALREADY_EXISTS} from "../../server/errorcodes"
import {SubmissionError} from 'redux-form'


export const addClient = (client) => ({
    type: AC.ADD_CLIENT,
    client: client
})
export const addClients = (clients) => ({
    type: AC.ADD_CLIENTS,
    clients: clients
})


export const getAllClientsFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/clients', {
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
                    dispatch(addClients(json.data))
                }
            })
    }
}
export const addClientOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/clients',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(addClient(json.data))
                }
                return json
            }
        )
    }
}
