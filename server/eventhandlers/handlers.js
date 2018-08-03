import * as SC from "../serverconstants";
import * as MDL from "../models";
import momentTZ from "moment-timezone";
import * as H from './handlers'
import * as U from '../utils'
import logger from '../logger'


const processTasks = async (tasks) => {
    for (const task of tasks) {
        logger.debug("Adding unreported warning against task plan [" + task.task.name + "]")
        let warningResponse = await MDL.WarningModel.addUnreported(task)
        logger.debug("generateUnreportedWarnings(): ", {warningResponse})
        await MDL.TaskPlanningModel.updateFlags(warningResponse)
    }
}


export const generateUnreportedWarnings = async (event, data) => {
    logger.debug("generateUnreportedWarnings(): called", {data}, {date: new Date()})
    //console.log("generateUnreportedWarnings(): called with event ", event)

    // Find date in India as this event runs at 1am Indian time
    let moment = momentTZ.tz(SC.INDIAN_TIMEZONE).startOf('day')

    moment = U.sameMomentInUTC(moment.toDate())
    // Since task plannings are placed in UTC we need to convert it to UTC

    // Find out all the task plans which are left unreported in past dates
    let tasks = await MDL.TaskPlanningModel.find({
        planningDate: {$lt: moment.toDate()},
        'report.reportedOnDate': null
    })

    logger.debug("generateUnreportedWarnings(): found [" + tasks.length + "] that are un reported")

    if (tasks && tasks.length) {
        await processTasks(tasks)
    }

    return true
}

/**
 * Processes events one by one
 * @param events
 * @returns {Promise<void>}
 */
export const processEvents = async events => {
    let now = new Date()
    for (const e of events) {
        // Need to see if this event is indeed need to be execute by by comparing current date/time with time parsed using timezone
        let eventMoment = momentTZ.tz(e.execution.dateString, e.execution.format, e.execution.timeZone)
        if (eventMoment.isBefore(now)) {
            console.log("Event with method [" + e.method + "] is eligible to be executed now")
            // iterate on date array and create object from that
            let data = {}
            if (e.data && e.data.length) {
                e.data.forEach(d => {
                    data[d.key] = d.value
                })
            }
            await H[e.method](e, data)

        } else {
            console.log("Event with method [" + e.method + "] is not eligible to be executed now")
        }
    }
}

export const executeEvents = async () => {
    console.log("Executing events ", new Date())
    let now = momentTZ.utc().add(5, 'h').add(31, 'm')
    let events = await MDL.EventModel.find({
        "execution.dateInUTC": {$lt: now.toDate()},
        status: SC.EVENT_SCHEDULED
    })

    console.log("found [" + events.length + "] events to run ")
    if (events && events.length) {
        await processEvents(events)
    }
}