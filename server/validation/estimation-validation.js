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

export const estimationEstimatorAddTaskStruct = t.struct({
    name: RequiredString,
    description: RequiredString,
    estimatedHours: t.Number,
    estimation: t.struct({
        _id: ObjectId
    }),
    feature: t.maybe(t.struct({
        _id: ObjectId
    })),
    repo: t.maybe(t.struct({
        _id: ObjectId
    })),
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    notes: t.maybe(t.list(
        t.struct({
            name: t.String,
            note: t.String
        })
        )
    )
})