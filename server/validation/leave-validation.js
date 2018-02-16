import {RequiredString, ObjectId, validate} from "./index"
import t from 'tcomb-validation'

export const leaveRequestAdditionStruct = t.struct({
    leaveType: t.struct({
        _id: ObjectId
    }),
    //dayType:RequiredString,
    description: RequiredString,
    startDate: RequiredString,
    endDate:   RequiredString
})
