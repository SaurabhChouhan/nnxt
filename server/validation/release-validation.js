import {ObjectId, RequiredString} from "./index"
import t from 'tcomb-validation'

export const releaseTaskPlanningStruct = t.struct({
    _id: t.Nil,
    releasePlan: t.struct({
        _id: ObjectId
    }),
    employee: t.struct({
        _id: ObjectId
    }),
    task: t.struct({
        _id: ObjectId
    }),
    release: t.struct({
        _id: ObjectId
    }),
    planning: t.struct({
        plannedHours: t.Number
    }),
    planningDate: RequiredString,
})

export const releaseTaskPlanningCommentStruct = t.struct({
    _id: t.Nil,
    releaseID: ObjectId,
    releasePlanID: ObjectId,
    comment: RequiredString,
    commentType: RequiredString,
})