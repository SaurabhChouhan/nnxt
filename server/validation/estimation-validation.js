import {ObjectId, RequiredString} from "./index"
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
    developmentType: t.struct({
        _id: ObjectId
    }),
    notes: t.Nil,
    release: t.Nil,
    isDeleted: t.Nil,
    isArchived: t.Nil
})

export const estimationUpdationStruct = t.struct({
    _id: ObjectId,
    description: RequiredString,
    estimator: t.struct({
        _id: ObjectId
    }),
    project: t.struct({
        _id: ObjectId
    }),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
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
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
})

export const estimationNegotiatorUpdateTaskStruct = t.struct({
    _id: ObjectId,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
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
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
})

export const estimationNegotiatorAddFeatureStruct = t.struct({
    _id: t.Nil,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
    estimation: t.struct({
        _id: ObjectId
    }),
    repo: t.maybe(t.struct({
        _id: ObjectId
    })),
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
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    ),
    repo: t.maybe(t.struct({_id: t.Nil}))
})

export const estimationNegotiatorUpdateFeatureStruct = t.struct({
    _id: ObjectId,
    name: t.maybe(RequiredString),
    description: t.maybe(RequiredString),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    ),
    repo: t.maybe(t.struct({_id: t.Nil}))
})


export const estimationCreateReleaseByNegotiatorStruct = t.struct({
    estimation: t.struct({
        _id: ObjectId
    }),
    releaseVersionName: RequiredString,
    billedHours: t.Number,
    clientReleaseDate: RequiredString,
    devStartDate: RequiredString,
    devReleaseDate: RequiredString,
    manager: t.struct({
        _id: ObjectId
    }),
    leader: t.struct({
        _id: ObjectId
    }),
    team: t.list(
        t.struct({
            _id: ObjectId,
            name: t.String,
            email: t.String,
        })
    )
})

export const estimationAddToReleaseByNegotiatorStruct = t.struct({
    estimation: t.struct({
        _id: ObjectId
    }),
    release: t.struct({
        _id: ObjectId
    }),
    billedHours: t.Number,
    clientReleaseDate: RequiredString,
    devStartDate: RequiredString,
    devReleaseDate: RequiredString
})


