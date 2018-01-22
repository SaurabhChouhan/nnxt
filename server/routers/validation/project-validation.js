import {RequiredString, validate} from "./"
import t from 'tcomb-validation'

export let projectAdd = t.struct({
    name: RequiredString,
    client: t.struct({
        _id: RequiredString
    })
})
