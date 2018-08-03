import * as SC from "../serverconstants";
import {EventModel} from "../models";
import momentTZ from "moment-timezone";
import * as H from './handlers'

export const generateUnreportedWarnings = (data) => {
    console.log("Generating unreported warnings ", new Date())
}

export const executeEvents = async () => {
    console.log("Executing events ", new Date())
    let now = momentTZ.utc().add(5, 'h').add(31, 'm')
    let events = await EventModel.find({
        "execution.dateInUTC": {$lt: now.toDate()},
        status: SC.EVENT_SCHEDULED
    })

    console.log("h is ", H)
    console.log("found [" + events.length + "] events to run ")
    if (events && events.length) {
        let now = new Date()
        events.forEach(e => {
            console.log("processing ", e)
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
                console.log("Method [" + e.method + "] would be called with data as ", data)
            } else {
                console.log("Event with method [" + e.method + "] is not eligible to be executed now")
            }
        })
    }

    /*
    await new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(1)
        }, 1000 * 10)
    })
    */
}