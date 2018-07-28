import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import userReducer from './userReducer'
import appReducer from './appReducer'
import permissionReducer from './permissionReducer'
import roleReducer from './roleReducer'
import clientReducer from './clientReducer'
import estimationReducer from './estimationReducer'
import projectReducer from './projectReducer'
import technologyReducer from './technologyReducer'
import leaveReducer from './leaveReducer'
import repositoryReducer from './repositoryReducer'
import attendanceSettingReducer from './attendanceSettingReducer'
import releaseReducer from './releaseReducer'
import calendarReducer from './calendarReducer'
import reportingReducer from './reportingReducer'
import warningReducer from './warningReducer'
import holidayReducer from './holidayReducer'
import dashboardReducer from './dashboardReducer'


const reducers = combineReducers({
    form: formReducer, // Redux form state
    user: userReducer,
    app: appReducer,
    permission: permissionReducer,
    role: roleReducer,
    client: clientReducer,
    estimation: estimationReducer,
    project: projectReducer,
    technology: technologyReducer,
    leave: leaveReducer,
    repository: repositoryReducer,
    attendanceSetting: attendanceSettingReducer,
    release: releaseReducer,
    calendar: calendarReducer,
    report: reportingReducer,
    warning: warningReducer,
    holiday: holidayReducer,
    dashboard: dashboardReducer
})
export default reducers