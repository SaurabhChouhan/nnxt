import Router from 'koa-router'
import * as MDL from "../models"
import * as V from "../validation"
import logger from '../logger'
import * as U from '../utils'

let migrationRouter = new Router({
    prefix: "/migration"
})

migrationRouter.get('/updateEmployeeDays', async ctx => {
    /*
      Need to first fetch all releases and then iterate over all developer of that release and then their task plans
      and then update employee days
    */


    let releases = await MDL.ReleaseModel.find()

    for(const release of releases){
        await processReleaseToUpdateEmployeeDays(release)
    }

    return ctx.body = 'success'
})

const processReleaseToUpdateEmployeeDays = async (release) => {
    logger.info("processing release ["+release.name+"] found with type as ["+release.releaseType+"]")
    let taskPlans = await MDL.TaskPlanningModel.find({'release._id':release._id}, {employee:true, planningDateString:true, 'planning.plannedHours':true, 'report.reportedHours':true})
    // Iterate on each task plan and update employee days accordingly, it is assumed that initially employee days have be removed and would be created afresh
    for(const taskPlan of taskPlans){
        await processTaskPlanToUpdateEmployeeDays(taskPlan, release)
    }
}

const processTaskPlanToUpdateEmployeeDays = async (taskPlan, release) => {
    let employeeDay = await MDL.EmployeeDaysModel.findOne({'employee._id': taskPlan.employee._id, 'dateString': taskPlan.planningDateString})
    logger.info('Processing task plan ', {taskPlan})
    if(!employeeDay){
        logger.info('No employee days found ', {employeeDay})
        // need to create employee days
        employeeDay = new MDL.EmployeeDaysModel()
        employeeDay.plannedHours = taskPlan.planning.plannedHours

        if(taskPlan.report && taskPlan.report.reportedHours){
            employeeDay.reportedHours = taskPlan.report.reportedHours
            employeeDay.releaseTypes = [{releaseType: release.releaseType, plannedHours: taskPlan.planning.plannedHours, reportedHours: taskPlan.report.reportedHours}]
        } else {
            employeeDay.releaseTypes = [{releaseType: release.releaseType, plannedHours: taskPlan.planning.plannedHours}]
        }
        
        employeeDay.employee = {
            _id: taskPlan.employee._id,
            name: taskPlan.employee.name
        }
        employeeDay.dateString = taskPlan.planningDateString
        employeeDay.date = U.momentInUTC(taskPlan.planningDateString)
        await employeeDay.save()

    } else {
        // need to update employee days accordingly
        logger.info('employee days found ', {employeeDay})
        employeeDay.plannedHours += taskPlan.planning.plannedHours

        if(taskPlan.report && taskPlan.report.reportedHours){
            employeeDay.reportedHours += taskPlan.report.reportedHours
        }

        let typeIdx = employeeDay.releaseTypes.findIndex(s => s.releaseType == release.releaseType)
        if (typeIdx > -1) {
            employeeDay.releaseTypes[typeIdx].plannedHours += taskPlan.planning.plannedHours
            if(taskPlan.report && taskPlan.report.reportedHours){
              employeeDay.releaseTypes[typeIdx].reportedHours += taskPlan.report.reportedHours
            }
        } else {
            if(taskPlan.report && taskPlan.report.reportedHours){
                employeeDay.releaseTypes.push({
                    releaseType: release.releaseType,
                    plannedHours: taskPlan.planning.plannedHours,
                    reportedHours:taskPlan.report.reportedHours
                })
            } else {
                employeeDay.releaseTypes.push({
                    releaseType: release.releaseType,
                    plannedHours: taskPlan.planning.plannedHours
                })
            }
        }

        logger.info('updated employee days ', {employeeDay})
        await employeeDay.save()
    }
}

export default migrationRouter