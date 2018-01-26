import {RequiredString, ObjectId, validate} from "./index"
import t from 'tcomb-validation'

export const estimationInitiationStruct = t.struct({
    description: RequiredString,
    estimator: t.struct({
        _id: ObjectId
    }),
    project: t.struct({
        _id: ObjectId
    }),
    technologies: t.maybe(t.list(t.String))
})

