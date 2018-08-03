import * as SC from "../serverconstants";
import {EventModel} from "../models";
import momentTZ from "moment-timezone";
import * as H from './handlers'

export const generateUnreportedWarnings = async (event, data) => {
    console.log("generateUnreportedWarnings(): called with data ", data)
    //console.log("generateUnreportedWarnings(): called with event ", event)

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 1000 * 20)
    })
}

export const monthlyWorkSummaryEvent = async (event, data) => {
    console.log("generateEmployeeMonthlyReport(): called with data ", data)
    //console.log("generateEmployeeMonthlyReport(): called with event ", event)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 1000 * 20)
    })
}

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
    let events = await EventModel.find({
        "execution.dateInUTC": {$lt: now.toDate()},
        status: SC.EVENT_SCHEDULED
    })

    console.log("found [" + events.length + "] events to run ")
    if (events && events.length) {
        await processEvents(events)
    }
}