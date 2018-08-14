import * as AC from "./actionConsts"
import {addProjects, deleteProject, editProject} from "./projectAction";


export const addModules = (modules) => ({
    type: AC.ADD_MODULES,
    modules: modules
})

export const addModule = (module) => ({
    type: AC.ADD_MODULE,
    module: module
})


export const editModule = (module) => ({
    type: AC.EDIT_MODULE,
    module: module
})


export const deleteModule = (moduleID) => ({
    type: AC.DELETE_MODULE,
    moduleID: moduleID
})



export const getAllModulesFromServer = () => {
    return (dispatch, getState) => {
        return fetch('/api/modules', {
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
                    dispatch(addModules(json.data))
                }
            })
    }
}


export const addModuleOnServer = (formInput) => {
    return function (dispatch, getState) {
        return fetch('/api/modules',
            {
                method: "post",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain',
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
                dispatch(addModule(json.data))


            }
            return json
        })
    }
}


export const editModuleOnServer = (module) => {
    return function (dispatch, getState) {
        return fetch('/api/modules',
            {
                method: "put",
                credentials: "include",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(module)
            }
        ).then(
            response => {
                return response.json()
            }
        ).then(json => {
            if (json.success) {
                dispatch(editModule(json.data))
            }
            return json
        })
    }
}

export const deleteModuleOnServer = (moduleID) => {
    return function (dispatch, getState) {
        return fetch('/api/modules/' + moduleID,
            {
                method: "delete",
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
                dispatch(deleteModule(moduleID))
            }
            return json
        })
    }
}
