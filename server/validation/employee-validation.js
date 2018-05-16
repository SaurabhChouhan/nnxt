import {ObjectId, RequiredString} from "./index"
import t from 'tcomb-validation'

export const employeeAddEmployeeDaysStruct = t.struct({
    _id: t.Nil,
    project: t.struct({
        _id: ObjectId,
        name: t.String
    }),
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