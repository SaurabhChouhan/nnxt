import * as AC from './actionConsts'

export const showSelectedTaskDetail = (event) => ({
    type: 'SHOW_SELECTED_TASK_DETAIL',
    event: event
})
export const changeNavigationView=(view,date)=>({
    type:'CHANGE_CALENDAR_NAVIGATION',
    view:view,
    date:date
})
export const showCalendarView = () => ({
    type: 'SHOW_CALENDAR_VIEW'
})