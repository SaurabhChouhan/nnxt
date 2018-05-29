import {ObjectId, RequiredString} from "./index"
import t from 'tcomb-validation'

export const leaveRequestAdditionStruct = t.struct({
    leaveType: t.struct({
        _id: ObjectId
    }),
    dayType: RequiredString,
    description: RequiredString,
    startDate: RequiredString,
    endDate: RequiredString
});
export const leaveCreateSettingStruct = t.struct({
    _id: t.Nil,
    casualLeaves: t.Number,
    paidLeaves: t.Number,
    maternityLeaves: t.Number,
    paternityLeaves: t.Number,
    specialLeaves: t.Number

});

export const leaveUpdateSettingStruct = t.struct({
    _id: ObjectId,
    casualLeaves: t.Number,
    paidLeaves: t.Number,
    maternityLeaves: t.Number,
    paternityLeaves: t.Number,
    specialLeaves: t.Number

});