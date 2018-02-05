import {RequiredString, ObjectId, validate} from "./index"
import t from 'tcomb-validation'

export const estimationInitiationStruct = t.struct({
    _id: t.Nil,
    description: RequiredString,
    estimator: t.struct({
        _id: ObjectId
    }),
    project: t.struct({
        _id: ObjectId
    }),
    technologies: t.maybe(t.list(t.String)),
    notes: t.Nil,
    release: t.Nil,
    isDeleted: t.Nil,
    isArchived: t.Nil
})

export const estimationEstimatorAddTaskStruct = t.struct({
    _id: t.Nil,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
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
            note: t.String
        })
        )
    )
})

export const estimationEstimatorUpdateTaskStruct = t.struct({
    _id: RequiredString,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
    estimatedHours: t.Number,
    feature: t.maybe(t.struct({
        _id: ObjectId
    })),
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
})


export const estimationEstimatorAddFeatureStruct = t.struct({
    _id: t.Nil,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
    estimation: t.struct({
        _id: ObjectId
    }),
    repo: t.maybe(t.struct({
        _id: ObjectId
    })),
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
})

export const estimationNegotiatorAddTaskStruct = t.struct({
    _id: t.Nil,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
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
            note: t.String
        })
        )
    )
})