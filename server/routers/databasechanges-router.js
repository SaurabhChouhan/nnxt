import Router from 'koa-router'
import * as MDL from "../models"
import * as U from "../utils";
import logger from '../logger'

const databaseChangesRouter = new Router({
    prefix: "database-changes"
})


const employeeDaysUpdate = async (employeeDays) => {
    for (const employeeDay of employeeDays) {
        let daySums = await MDL.TaskPlanningModel.aggregate([{
            $match: {planningDate: employeeDay.date, 'employee._id': employeeDay.employee._id}
        }, {
            $project: {
                planningDate: 1,
                planningDateString: 1,
                employee: 1,
                planning: {
                    plannedHours: 1
                },
                report: {
                    reportedHours: 1
                }
            }
        }, {
            $group: {
                _id: null, // Grouping all records
                plannedHours: {$sum: '$planning.plannedHours'},
                reportedHours: {$sum: '$report.reportedHours'}
            }
        }])

        //logger.debug("daySums ", {daySums})
        if (daySums && daySums.length) {
            logger.debug("[employee = " + employeeDay.employee._id + "], [date=" + employeeDay.dateString + "], [plannned hours=" + daySums[0].plannedHours + "] , [Reported hours=" + daySums[0].reportedHours + "]")
            await MDL.EmployeeDaysModel.update({_id: employeeDay._id}, {
                $set: {
                    'plannedHours': daySums[0].plannedHours,
                    'reportedHours': daySums[0].reportedHours
                }
            })
        }
    }
}

/*
  This method would add reported hours against employee days as previously reported hours were not
  going into employee days
 */

databaseChangesRouter.post("/employee-days", async ctx => {
    let employeeDays = await MDL.EmployeeDaysModel.find()
    await employeeDaysUpdate(employeeDays)

    return {}

    // iterate on each employee days and update its planned hours and reported hours based on task planned on that day
})

export default databaseChangesRouter
