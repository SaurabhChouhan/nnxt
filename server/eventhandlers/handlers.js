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
        await MDL.TaskPlanningModel.updateFlags(warningResponse)
    }
}

export const generateUnreportedWarnings = async (event, data) => {
    logger.debug("generateUnreportedWarnings(): called", {data}, {date: new Date()})
    //console.log("generateUnreportedWarnings(): called with event ", event)

    // Find date in India as this event runs at 1am Indian time
    let moment = momentTZ.tz(SC.INDIAN_TIMEZONE).startOf('day')

    moment = U.sameMomentInUTC(moment.toDate())

    logger.debug("generateUnreportedWarnings(): ", {moment})
    // Since task plannings are placed in UTC we need to convert it to UTC

    // Find out all the task plans which are left unreported in past dates
    let tasks = await MDL.TaskPlanningModel.find({
        planningDate: {$lt: moment.toDate()},
        'report.reportedOnDate': null
    })

    if (tasks && tasks.length) {
        logger.debug("Found ["+tasks.length+'] unreported tasks for moment ', {moment})
        await processTasks(tasks)
    } else {
        logger.debug("No unreported tasks found for moment ", {moment})
    }

    await event.eventExecutionSuccessful()
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
        // Need to see if this event needs to be executed or not based pon current date/time in timezone
        let eventMoment = momentTZ.tz(e.execution.dateString, e.execution.format, e.execution.timeZone)
        logger.debug("processEvents() ", {eventMoment})
        if (eventMoment.isBefore(now)) {
            logger.info("[======= " + e.method + " =========] is eligible to be executed now")
            // iterate on date array and create object from that
            let data = {}
            if (e.data && e.data.length) {
                e.data.forEach(d => {
                    data[d.key] = d.value
                })
            }
            try {
                await H[e.method](e, data)
                // event execution successful
            } catch (e) {
                console.log(e)
                logger.info("[======= " + e.method + " =========] execution failed!")
            }
        } else {
            logger.debug("Event with method [" + e.method + "] is not eligible to be executed now")
            await e.eventNotEligible()
        }
    }
}

export const executeEvents = async () => {
    // adding 5 hours 31 minutes would ensure that all events that are added for India do get selected
    let now = momentTZ.utc().add(5, 'h').add(31, 'm')
    logger.debug("Checking events that are expired on ", {now})

    let events = await MDL.EventModel.find({
        "execution.dateInUTC": {$lt: now.toDate()},
        status: SC.EVENT_SCHEDULED
    })

    // Mark all this events as running to prevent them from picking by other process
    MDL.EventModel.update({
        "execution.dateInUTC": {$lt: now.toDate()},
        status: SC.EVENT_SCHEDULED
    }, {
        $set: {
            status: SC.EVENT_RUNNING
        }
    })

    if (events && events.length) {
        await processEvents(events)
    }
}