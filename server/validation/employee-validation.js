import t from 'tcomb-validation'
import {ObjectId} from "./index"

export const employeeCreateSettingStruct = t.struct({
    _id: t.Nil,
    maxPlannedHours: t.Number,
    minPlannedHours: t.Number,
    free: t.Number,
    relativelyFree: t.Number,
    busy: t.Number,
    superBusy: t.Number

})
export const employeeUpdateSettingStruct = t.struct({
    _id: ObjectId,
    maxPlannedHours: t.Number,
    minPlannedHours: t.Number,
    free: t.Number,
    relativelyFree: t.Number,
    busy: t.Number,
    superBusy: t.Number

})