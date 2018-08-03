import mongoose from 'mongoose'
import * as SC from "../serverconstants";
import * as U from "../utils"
import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise

let eventSchema = mongoose.Schema({
    method: {type: String, required: true}, // Name of event handler
    data: [{
        key: {type: String},
        value: {type: String}
    }],

    /*
        scheduled - Will run on execution time configured
        running - Event is running should not be run again until status changes
        completed - Event is completed and will not run again, recurring event would never be in this status unless they are cancelled
        failed - Event failed with certain error, need to be manually scheduled again
     */
    status: [{
        type: String,
        enum: [SC.EVENT_SCHEDULED, SC.EVENT_RUNNING, SC.EVENT_COMPLETED, SC.EVENT_FAILED]
    }],
    error: {type: String}, // Any error occurred during last execution
    // Date of next execution
    execution: {
        dateString: {type: String}, // date in format specified in format field
        dateInUTC: Date, // Date recorded in UTC
        minDateString: {type: String}, //
        minDateInUTC: Date, // Minimum date after which this event should execute
        maxDateString: {type: String}, // date in format specified in format field
        maxDateInUTC: Date, // Maximum date after which this event should execute
        dateString: {type: String}, // date in format specified in format field
        dateInUTC: Date, // Date recorded in UTC
        format: {type: String, default: SC.DATE_TIME_24HOUR_FORMAT},
        timeZone: {type: String, default: SC.INDIAN_TIMEZONE},
        increment: {type: Number}, // Date incremented by this number (used in recurring event to get next execution date
        // unit to increment (used in recurring event to get next date
        incrementUnit: {
            type: String,
            enum: [SC.MOMENT_MINUTES, SC.MOMENT_HOURS, SC.MOMENT_DAYS, SC.MOMENT_WEEKS, SC.MOMENT_MONTHS, SC.MOMENT_QUARTERS, SC.MOMENT_YEARS]
        }
    },
    eventType: {
        type: String,
        enum: [SC.EVENT_ONETIME, SC.EVENT_RECURRING],
        default: SC.EVENT_ONETIME
    }
})

eventSchema.statics.addRecurEvent = async (eventInput) => {
    return await addEvent(eventInput, SC.EVENT_RECURRING)
}

eventSchema.statics.addOneTimeEvent = async (eventInput) => {
    return await addEvent(eventInput, SC.EVENT_ONETIME)
}

const addEvent = async (eventInput, eventType) => {
    let event = new EventModel()
    event.method = eventInput.method
    event.data = eventInput.data
    event.status = SC.EVENT_SCHEDULED
    let execution = U.momentFromDateInUTC(eventInput.date)
    let min = U.momentFromDateInUTC(eventInput.minDate)
    let max = U.momentFromDateInUTC(eventInput.maxDate)

    event.execution = {
        dateString: execution.format(eventInput.format),
        dateInUTC: execution.toDate(),
        minDateString: min.format(eventInput.format),
        minDateInUTC: min.toDate(),
        maxDateString: max.format(eventInput.format),
        maxDateInUTC: max.toDate(),
        format: eventInput.format,
        timeZone: eventInput.timeZone,
        increment: eventInput.increment,
        incrementUnit: eventInput.incrementUnit
    }
    event.eventType = eventType
    return await event.save()
}

const EventModel = mongoose.model("events", eventSchema)
export default EventModel