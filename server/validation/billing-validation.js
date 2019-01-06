import { ObjectId, RequiredString, validDate } from './index'
import t from 'tcomb-validation'

export const billingTaskSearchStruct = t.struct({
    clientID: ObjectId,
    releaseID: ObjectId,
    fromDate: validDate
})
