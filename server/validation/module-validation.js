import {RequiredString} from "./index"
import t from 'tcomb-validation'

export let moduleAdditionStruct = t.struct({
    name: RequiredString,
    project: t.struct({
        _id: RequiredString
    })
})
