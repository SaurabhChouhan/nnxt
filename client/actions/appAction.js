import * as AC from './actionConsts'

export const showComponentHideOthers = name => ({
    type: AC.SHOW_COMPONENT_HIDE_OTHER,
    name: name
})

export const showComponent = name => ({
    type: AC.SHOW_COMPONENT,
    name: name
})

export const hideComponent = name => ({
    type: AC.HIDE_COMPONENT,
    name: name
})

export const addSSRFlag = () => ({
    type: AC.ADD_SSR_FLAG
})

export const clearSSRFlag = () => ({
    type: AC.CLEAR_SSR_FLAG
})


export const showLoader = () => ({
    type: AC.SHOW_LOADER
})

export const hideLoader = () => ({
    type: AC.HIDE_LOADER
})

export const setScreenSize = (height, width) => ({
    type: AC.SET_SCREEN_SIZE,
    screenWidth: width,
    screenHeight: height
})