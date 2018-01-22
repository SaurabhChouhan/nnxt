import Router from 'koa-router'

let estimationRouter = new Router({
    prefix: "estimations"
})

estimationRouter.post('/request', async ctx => {
    return {"abc":"created"}
})

export default estimationRouter
