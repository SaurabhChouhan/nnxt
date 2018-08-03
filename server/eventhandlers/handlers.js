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
    if (events && events.length){
        events.forEach(e => {
            H[e.method]()
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