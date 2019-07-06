import mongoose from 'mongoose'
import { VALID_OWNER_TYPES } from '../serverconstants'

mongoose.Promise = global.Promise

/**
 * Billing rate is kept separate from all other model just to ensure that this information is not leaked un-necessarily
 */

let billingRateSchema = mongoose.Schema({
    billingRate: Number,
    owner: {
        _id: mongoose.Schema.ObjectId,
        type: { type: String, enum: VALID_OWNER_TYPES }
    },
    created: {
        _id: mongoose.Schema.ObjectId,
        name: String,
        date: { type: Date, default: Date.now() }
    },
    updated: {
        _id: mongoose.Schema.ObjectId,
        name: String,
        date: { type: Date }
    }
})

const BillingRateModel = mongoose.model("BillingRate", billingRateSchema)
export default BillingRateModel
