import { ObjectId, RequiredString, validDate } from './index'
import t from 'tcomb-validation'

export const billingTaskSearchStruct = t.struct({
    clientID: ObjectId,
    releaseID: t.maybe(ObjectId),
    fromDate: t.maybe(validDate),
    toDate: t.maybe(validDate)
})

export const billingTaskBillingClientsStruct = t.struct({
    fromDate: t.maybe(validDate),
    toDate: t.maybe(validDate)
})

export const billingTaskBillingReleasesStruct = t.struct({
    fromDate: t.maybe(validDate),
    toDate: t.maybe(validDate),
    clientID: ObjectId
})

