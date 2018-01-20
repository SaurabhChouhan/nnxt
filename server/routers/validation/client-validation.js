import {RequiredString, validate} from "./"
import t from 'tcomb-validation'

export let clientAdd = t.struct({
    name: RequiredString
})
