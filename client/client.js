import React from 'react';
import {hydrate} from 'react-dom'
import AppRouterContainer from './containers/AppRouterContainer'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import reducers from './reducers'

let store = createStore(reducers, __PRELOADED_STATE__, applyMiddleware(thunkMiddleware, logger))
//let store = createStore(reducers, __PRELOADED_STATE__, applyMiddleware(thunkMiddleware))
const App = props =>
    <Provider store={store}>
        <BrowserRouter>
            <AppRouterContainer/>
        </BrowserRouter>
    </Provider>


window.onload = () => {
    hydrate(
        <App/>,
        document.getElementById('root')
    )
}