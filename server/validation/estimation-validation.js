import {RequiredString, validate} from "./index"
import t from 'tcomb-validation'

export let estimationInitiationStruct = t.struct({
    description: RequiredString,
    estimator: t.struct({
        _id: RequiredString
    }),
    project: t.struct({
        _id: RequiredString
    }),
    technologies: t.maybe(t.list(t.String))
})