import {RequiredString, validate} from "./index"
import t from 'tcomb-validation'

export let technologyAdditionStruct = t.struct({
    name: RequiredString
})
