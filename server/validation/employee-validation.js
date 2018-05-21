import {ObjectId, RequiredString} from "./index"
import t from 'tcomb-validation'

export const employeeAddEmployeeDaysStruct = t.struct({
    _id: t.Nil,
    employee: t.struct({
        _id: ObjectId,
        name: t.String
    }),
    plannedHours: t.Number,
    dateString: RequiredString,
})

export const employeeUpdateEmployeeDaysStruct = t.struct({
    plannedHours: t.Number,
    dateString: RequiredString,
    employee: t.struct({
        _id: ObjectId,
        name: t.String
    })
})

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