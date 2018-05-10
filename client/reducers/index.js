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
import leaveRequestReducer from './leaveRequestReducer'
import repositoryReducer from './repositoryReducer'
import attendanceSettingReducer from './attendanceSettingReducer'
import releaseReducer from './releaseReducer'
import calendarPageReducer from './calendarPageReducer'
import reportingReducer from './reportingReducer'


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
    leaveRequest: leaveRequestReducer,
    repository: repositoryReducer,
    attendanceSetting: attendanceSettingReducer,
    release: releaseReducer,
    calendar: calendarPageReducer,
    report: reportingReducer
})
export default reducers