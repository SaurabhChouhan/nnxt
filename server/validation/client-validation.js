import {RequiredString} from "./index"
import t from 'tcomb-validation'

export let clientAdditionStruct = t.struct({
    name: RequiredString
})
