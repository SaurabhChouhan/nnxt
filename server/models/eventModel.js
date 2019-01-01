import mongoose from 'mongoose'
import * as SC from "../serverconstants";
import * as U from "../utils"
import momentTZ from 'moment-timezone'
import logger from '../logger'

mongoose.Promise = global.Promise

let eventSchema = mongoose.Schema({
    method: { type: String, required: true }, // Name of event handler
    data: [{
        key: { type: String },
        value: { type: String }
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
    error: { type: String }, // Any error occurred during last execution
    // Date of next execution
    execution: {
        moveExecutionToFuture: { type: Boolean, default: false }, // should new execution time calculates in such a way that it always remains ahead of now
        dateString: { type: String }, // date in format specified in format field
        dateInUTC: Date, // Date recorded in UTC
        minDateString: { type: String }, //
        minDateInUTC: Date, // Minimum date after which this event should execute
        maxDateString: { type: String }, // date in format specified in format field
        maxDateInUTC: Date, // Maximum date after which this event should execute
        format: { type: String, default: SC.DATE_TIME_24HOUR_FORMAT },
        timeZone: { type: String, default: SC.INDIAN_TIMEZONE },
        increment: { type: Number, default: 0 }, // Date incremented by this number (used in recurring event to get next execution date
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

eventSchema.methods.eventExecutionSuccessful = async function () {
    logger.debug("eventExecutionSuccessful() called for ", { event: this.method })
    if (this.eventType == SC.EVENT_RECURRING && this.execution.dateInUTC && this.execution.increment > 0 && this.execution.incrementUnit) {
        // This is a recurring event update its execution time
        let m = new momentTZ(this.execution.dateInUTC).add(this.execution.increment, this.execution.incrementUnit)
        let m1 = m.clone()
        m1.subtract(5, 'h').subtract(31, 'm')

        let now = new Date()
        while (m1.isBefore(now) && this.execution.moveExecutionToFuture) {
            m.add(this.execution.increment, this.execution.incrementUnit)
            m1 = m.clone()
            m1.subtract(5, 'h').subtract(31, 'm')
        }
        this.execution.dateInUTC = m.toDate()
        this.execution.dateString = U.momentInTZFromUTCMoment(m, this.execution.timeZone).format(this.execution.format)
        this.status = SC.EVENT_SCHEDULED
        
    } else if (this.eventType == SC.EVENT_ONETIME) {
        // this is a one time event mark status as completed
        this.status = SC.EVENT_COMPLETED
    }
    await this.save()
}

eventSchema.methods.eventNotEligible = async function () {
    // as event is not eligible to run at the moment change its status to scheduled again
    logger.debug("eventNotEligible() called for ", { event: this.method })
    this.status == SC.EVENT_SCHEDULED
    await this.save()
}


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
    let execution = eventInput.executionMoment
    let executionUTC = U.momentInUTCFromMoment(eventInput.executionMoment)
    logger.debug("addEvent(): execution moment is ", { executionUTC })
    let min = eventInput.minDate ? U.sameMomentInUTC(eventInput.minDate) : undefined
    let max = eventInput.maxDate ? U.sameMomentInUTC(eventInput.maxDate) : undefined

    event.execution = {
        dateString: eventInput.executionMoment.format(eventInput.format),
        dateInUTC: executionUTC.toDate(),
        minDateString: min ? min.format(eventInput.format) : undefined,
        minDateInUTC: min ? min.toDate() : undefined,
        maxDateString: max ? max.format(eventInput.format) : undefined,
        maxDateInUTC: max ? max.toDate() : undefined,
        format: eventInput.format,
        timeZone: eventInput.timeZone,
        increment: eventInput.increment,
        incrementUnit: eventInput.incrementUnit,
        moveExecutionToFuture: eventInput.moveExecutionToFuture
    }
    event.eventType = eventType
    return await event.save()
}


const EventModel = mongoose.model("events", eventSchema)
export default EventModel