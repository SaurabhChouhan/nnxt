import {RequiredString} from "./index"
import t from 'tcomb-validation'

export let technologyAdditionStruct = t.struct({
    name: RequiredString
})
