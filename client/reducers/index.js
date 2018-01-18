import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import userReducer from './userReducer'
import appReducer from './appReducer'
import permissionReducer from './permissionReducer'
import roleReducer from './roleReducer'

const reducers = combineReducers({
    form: formReducer, // Redux form state
    user: userReducer,
    app:appReducer,
    permission:permissionReducer,
    role:roleReducer
})
export default reducers