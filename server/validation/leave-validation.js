import {RequiredString, ObjectId, validate} from "./index"
import t from 'tcomb-validation'

export const leaveRequestAdditionStruct = t.struct({
    _id: t.Nil,
    user: t.struct({
        _id: ObjectId,
        firstName: RequiredString,
        lastName: RequiredString,
    }),
    status: RequiredString,
    approver: t.struct({
        _id: t.Nil,
        name: t.Nil,
        reason: t.Nil
    }),
    leave: t.struct({
        type: RequiredString,
        description: t.Nil,
        createdDate: t.Nil,
        from: RequiredString,
        to: RequiredString,
        numberOfLeaveDays: t.Nil
    }),
    isDeleted: t.Nil
})
