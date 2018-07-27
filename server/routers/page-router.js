import React from 'react'
import Router from 'koa-router'
import {isAdmin, isAuthenticated, isSuperAdmin} from "../utils";
import {createStore} from 'redux'
import reducers from '../../client/reducers'
import {StaticRouter} from 'react-router-dom'
import ReactDomServer from 'react-dom/server'
import {Provider} from 'react-redux'
import AppRouterContainer from '../../client/containers/AppRouterContainer'
import * as MDL from '../models'
import * as A from "../../client/actions";
import appHomePageRouter from './apphome-page-router'
import * as RR from "./index";

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

    let permissions = await MDL.PermissionModel.getAll()

    let store = createStore(reducers)
    store.dispatch(A.addLoginUser(ctx.state.user))
    store.dispatch(A.addSSRFlag())
    store.dispatch(A.addAllPermissions(permissions))
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
    let permissions = await  MDL.PermissionModel.getAll()
    let store = createStore(reducers)
    store.dispatch(A.addLoginUser(ctx.state.user))
    store.dispatch(A.addSSRFlag())
    store.dispatch(A.addAllPermissions(permissions))
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

pageRouter.use(appHomePageRouter.routes())

export default pageRouter