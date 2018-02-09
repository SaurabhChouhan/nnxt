import * as AC from "./actionConsts"



export const addClient = (client) => ({
    type: AC.ADD_CLIENT,
    client: client
})
export const addClients = (clients) => ({
    type: AC.ADD_CLIENTS,
    clients: clients
})
export const deleteClient = (clientID) => ({
    type: AC.DELETE_CLIENT,
    clientID: clientID
})
export const editClient = (client) => ({

    type: AC.UPDATE_CLIENT,
    client: client
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

export const deleteClientOnServer = (clientID) => {
    return function (dispatch, getState) {
        return fetch('/api/clients/' + clientID,
            {
                method: "delete",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'ap plication/json'
                }
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    dispatch(deleteClient(clientID))
                    // clear user form after update is successful
                }
                return json
            }
        )
    }
}
export const editClientOnServer = (client) => {
    return function (dispatch, getState) {
        return fetch('/api/clients',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
                if (json.success) {
                    console.log("Yor are now fatchning jason data",json.data)
                    dispatch(editClient(json.data))
                }
                return json
            }
        )
    }
}

