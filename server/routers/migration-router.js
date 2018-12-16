import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"

let migrationRouter = new Router({
    prefix: "/migration"
})

migrationRouter.get('/updateEmployeeDays', async ctx => {
    /*
      Need to first fetch all releases and then iterate over all developer of that release and then their task plans
      and then update employee days
    */


    let releases = await MDL.ReleaseModel.find({name:'ongoing'})

    for(const release of releases){
        await processReleaseToUpdateEmployeeDays(release)
    }

    return ctx.body = 'success'
})

const processReleaseToUpdateEmployeeDays = (release) => {
    console.log("processing release ["+release.name+"] found with type as ["+release.releaseType+"]")
}

export default migrationRouter