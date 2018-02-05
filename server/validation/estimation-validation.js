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

//Estimator Feature Validation Block Start
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

export const estimationEstimatorUpdateFeatureStruct = t.struct({
    _id: ObjectId,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    ),
    repo: t.maybe(t.struct({_id: t.Nil}))
})


export const estimationEstimatorMoveToFeatureStruct = t.struct({
    task_id: RequiredString,
    feature_id: RequiredString
})


//Estimator Feature Validation Block End

//Negotiator Feature Validation Block Start

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

//Negotiator Feature Validation Block Start