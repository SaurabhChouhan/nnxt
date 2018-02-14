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
    technologies: t.maybe(t.list(t.String)),
    tags: t.maybe(t.list(t.String)),
    notes: t.maybe(t.list(
        t.struct({
            note: t.String
        })
        )
    )
})

export const estimationEstimatorAddFeatureFromRepositoryStruct = t.struct({
    task_id: RequiredString
})


//Estimator Feature Validation Block End

//Negotiator Feature Validation Block Start

export const estimationNegotiatorUpdateFeatureStruct = t.struct({
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

export const estimationNegotiatorUpdateTaskStruct = t.struct({
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
    )
})

export const estimationProjectAwardByNegotiatorStruct = t.struct({
    estimation: t.struct({
        _id: ObjectId
    }),
    negotiatedBilledHours: t.Number,
    expectedClientReleaseDate: RequiredString,
    expectedStartDateOfDev: RequiredString,
    expectedDevReleaseDate: RequiredString,
    releaseVersionName: RequiredString,
    managerOfRelease: RequiredString,
    leaderOfRelease: RequiredString,
    plannedEmployeesForRelease: t.list(t.String)
})

