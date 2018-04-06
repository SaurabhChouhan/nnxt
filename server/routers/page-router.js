import React from 'react'
import Router from 'koa-router'
import {isSuperAdmin, isAdmin, isAuthenticated} from "../utils";
import {createStore, applyMiddleware} from 'redux'
import reducers from '../../client/reducers'
import {StaticRouter} from 'react-router-dom'
import ReactDomServer from 'react-dom/server'
import {Provider} from 'react-redux'
import {addLoginUser, addSSRFlag} from "../../client/actions"
import AppRouterContainer from '../../client/containers/AppRouterContainer'
import PermissionModel from '../models/permissionModel'
import {addAllPermissions} from "../../client/actions/permissionAction";

const pageRouter = new Router()

pageRouter.get("/", (ctx) => {
    return ctx.render("index", {preloadedState: JSON.stringify({})})
})


pageRouter.get('/logout', ctx => {
    ctx.logout()
    ctx.redirect('/')
})


pageRouter.get('/super-admin', async ctx => {


    if (!isSuperAdmin(ctx))
        return ctx.redirect('/')

    let permissions = await PermissionModel.getAll()

    let store = createStore(reducers)
    store.dispatch(addLoginUser(ctx.state.user))
    store.dispatch(addSSRFlag())
    store.dispatch(addAllPermissions(permissions))
    const initialState = store.getState()
    const context = {}

    const html = ReactDomServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url} context={context}>
                <AppRouterContainer/>
            </StaticRouter>
        </Provider>
    )


    return ctx.render("common", {
        html: '',
        preloadedState: JSON.stringify(initialState).replace(/</g, '\\u003c')
    })

})

pageRouter.get('/admin', async ctx => {
    if (!isAdmin(ctx))
        return ctx.redirect('/')
    let permissions = await PermissionModel.getAll()
    let store = createStore(reducers)
    store.dispatch(addLoginUser(ctx.state.user))
    store.dispatch(addSSRFlag())
    store.dispatch(addAllPermissions(permissions))
    const initialState = store.getState()
    const context = {}

    const html = ReactDomServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={ctx.url} context={context}>
                <AppRouterContainer/>
            </StaticRouter>
        </Provider>
    )

    return ctx.render("common", {
        html: '',
        preloadedState: JSON.stringify(initialState).replace(/</g, '\\u003c')
    })
})

pageRouter.use(function (ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/')
    }
})

pageRouter.get('/app-home', async ctx => {

    if (!isAuthenticated(ctx))
        return ctx.redirect('/')

    //let permissions = await PermissionModel.getAll()

    let store = createStore(reducers)
    store.dispatch(addLoginUser(ctx.state.user))
    store.dispatch(addSSRFlag())
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


export default pageRouter