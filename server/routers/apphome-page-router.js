import React from 'react'
import Router from 'koa-router'
import * as A from "../../client/actions";
import {createStore} from "redux";
import reducers from "../../client/reducers";
import {isAuthenticated} from "../utils";
import ReactDomServer from "react-dom/server";
import {Provider} from 'react-redux'
import {StaticRouter} from 'react-router-dom'
import AppRouterContainer from '../../client/containers/AppRouterContainer'


/***
 * Added prefix
 */

let appHomePageRouter = new Router({
    prefix: "app-home"
})

appHomePageRouter.get('*', async ctx => {
    if (!isAuthenticated(ctx))
        return ctx.redirect('/')

    //let permissions = await  MDL.PermissionModel.getAll()

    let store = createStore(reducers)
    store.dispatch(A.addLoginUser(ctx.state.user))
    store.dispatch(A.addSSRFlag())
    //store.dispatch(addAllPermissions(permissions))
    const initialState = store.getState()
    const context = {}

    const html = ReactDomServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url} context={context}>
                <AppRouterContainer/>
            </StaticRouter>
        </Provider>
    )


    return ctx.render("home", {
        html: '',
        preloadedState: JSON.stringify(initialState).replace(/</g, '\\u003c')
    })

})

export default appHomePageRouter
