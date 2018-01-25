import {NotificationManager} from 'react-notifications'
import {ADD_CLIENT} from "./actionConsts"
import {ALREADY_EXISTS} from "../../server/errorcodes"
import {SubmissionError} from 'redux-form'


export const addClient = (client) => ({
    type: ADD_CLIENT,
    client: client
})


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
                    NotificationManager.success('Client Added Successfully')

                } else {
                    NotificationManager.error('Client Not Added!')
                    if (json.code == ALREADY_EXISTS)
                        throw new SubmissionError({name: "Client Already Exists"})
                }
                return json
            }
        )
    }
}
