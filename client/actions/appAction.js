import {SHOW_COMPONENT, HIDE_COMPONENT, SHOW_LOADER, HIDE_LOADER, ADD_SSR_FLAG, CLEAR_SSR_FLAG} from "./actionConsts"

export const showComponentHideOthers = name => ({
    type: SHOW_COMPONENT,
    name: name
})

export const hideComponent = name => ({
    type: HIDE_COMPONENT,
    name: name
})

export const addSSRFlag = () => ({
    type: ADD_SSR_FLAG
})

export const clearSSRFlag = () => ({
    type: CLEAR_SSR_FLAG
})


export const showLoader = () => ({
    type: SHOW_LOADER
})

export const hideLoader = () => ({
    type: HIDE_LOADER
})