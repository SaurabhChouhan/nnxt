import {RequiredString} from "./index"
import t from 'tcomb-validation'

export let projectAdditionStruct = t.struct({
    name: RequiredString,
    client: t.struct({
        _id: RequiredString
    })
})
